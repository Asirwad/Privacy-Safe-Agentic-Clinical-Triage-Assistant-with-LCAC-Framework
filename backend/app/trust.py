"""Trust scoring engine for LCAC."""

from sqlmodel import Session, select
from app.models import TrustScore
from app.config import settings
from datetime import datetime
from typing import Optional


class TrustEngine:
    """Trust scoring engine."""
    
    def __init__(self, db_session: Session):
        self.db_session = db_session
    
    def get_trust_score(self, user_id: str) -> TrustScore:
        """Get or create trust score for a user."""
        trust_score = self.db_session.get(TrustScore, user_id)
        
        if not trust_score:
            trust_score = TrustScore(
                user_id=user_id,
                score=settings.trust_score_initial,
                violation_count=0,
                successful_inferences=0
            )
            self.db_session.add(trust_score)
            self.db_session.commit()
            self.db_session.refresh(trust_score)
        
        return trust_score
    
    def record_violation(self, user_id: str, reason: Optional[str] = None) -> TrustScore:
        """Record a policy violation and decrease trust score."""
        trust_score = self.get_trust_score(user_id)
        
        # Decrease score
        trust_score.score = max(
            settings.trust_score_min,
            trust_score.score - settings.trust_score_violation_penalty
        )
        trust_score.violation_count += 1
        trust_score.last_updated = datetime.utcnow()
        
        self.db_session.add(trust_score)
        self.db_session.commit()
        self.db_session.refresh(trust_score)
        
        return trust_score
    
    def record_success(self, user_id: str) -> TrustScore:
        """Record a successful inference and slightly increase trust score."""
        trust_score = self.get_trust_score(user_id)
        
        # Increase score (with cap)
        trust_score.score = min(
            settings.trust_score_max,
            trust_score.score + settings.trust_score_success_bonus
        )
        trust_score.successful_inferences += 1
        trust_score.last_updated = datetime.utcnow()
        
        self.db_session.add(trust_score)
        self.db_session.commit()
        self.db_session.refresh(trust_score)
        
        return trust_score
    
    def reset_trust_score(self, user_id: str) -> TrustScore:
        """Reset trust score to initial value."""
        trust_score = self.get_trust_score(user_id)
        trust_score.score = settings.trust_score_initial
        trust_score.violation_count = 0
        trust_score.successful_inferences = 0
        trust_score.last_updated = datetime.utcnow()
        
        self.db_session.add(trust_score)
        self.db_session.commit()
        self.db_session.refresh(trust_score)
        
        return trust_score

