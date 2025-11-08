"""LCAC (Least-Context Access Control) - Cognitive Control Plane.

This module implements the Cognitive Control Plane that enforces
zone-based access control, policy enforcement, and reasoning isolation.
"""

from typing import List, Dict, Optional, Tuple
from sqlmodel import Session, select
from app.models import Memory, Session as SessionModel, Audit, TrustScore
from app.config import settings
import hashlib
import json
from datetime import datetime


class LCACPolicy:
    """LCAC policy definition for zones."""
    
    # Zone policies: zone -> allowed tags
    ZONE_POLICIES: Dict[str, List[str]] = {
        "triage": ["symptoms", "vitals", "recent_visit"],
        "teleconsult": ["symptoms", "vitals", "recent_visit", "prescription"],
        "billing": ["billing_code", "insurance", "procedure"],
        "research": ["anonymized_data", "aggregate_stats"],
        "radiology": ["imaging_results", "radiology_report"],
    }
    
    # Disallowed tokens/patterns that indicate cross-zone leakage
    DISALLOWED_PATTERNS: List[str] = [
        "radiology",
        "x-ray",
        "imaging",
        "billing_code",
        "insurance_claim",
    ]
    
    @classmethod
    def get_allowed_tags(cls, zone: str) -> List[str]:
        """Get allowed tags for a zone."""
        return cls.ZONE_POLICIES.get(zone, [])
    
    @classmethod
    def is_tag_allowed(cls, zone: str, tag: str) -> bool:
        """Check if a tag is allowed for a zone."""
        allowed_tags = cls.get_allowed_tags(zone)
        return tag in allowed_tags
    
    @classmethod
    def check_content_violation(cls, zone: str, content: str) -> Tuple[bool, Optional[str]]:
        """Check if content violates zone policy."""
        content_lower = content.lower()
        for pattern in cls.DISALLOWED_PATTERNS:
            if pattern in content_lower:
                # Check if this pattern is actually allowed in the zone
                if not any(pattern in tag for tag in cls.get_allowed_tags(zone)):
                    return True, f"Content contains disallowed pattern: {pattern}"
        return False, None


class LCACEngine:
    """LCAC engine for enforcing cognitive access control."""
    
    def __init__(self, db_session: Session):
        self.db_session = db_session
        self.policy = LCACPolicy()
    
    def get_allowed_memories(self, zone: str, user_id: Optional[str] = None) -> List[Memory]:
        """Get memories allowed for a zone based on LCAC policy."""
        allowed_tags = self.policy.get_allowed_tags(zone)
        
        # Query memories in the zone with allowed tags
        statement = select(Memory).where(
            Memory.zone == zone,
            Memory.redacted == False
        )
        memories = self.db_session.exec(statement).all()
        
        # Filter by allowed tags
        filtered_memories = []
        for memory in memories:
            memory_tags = memory.get_tags()
            # Check if any memory tag is in allowed tags
            if any(tag in allowed_tags for tag in memory_tags):
                filtered_memories.append(memory)
        
        return filtered_memories
    
    def filter_memories_by_tags(self, memories: List[Memory], zone: str) -> List[Memory]:
        """Filter memories to only include those with allowed tags for the zone."""
        allowed_tags = self.policy.get_allowed_tags(zone)
        filtered = []
        
        for memory in memories:
            if memory.redacted:
                continue
            
            memory_tags = memory.get_tags()
            if any(tag in allowed_tags for tag in memory_tags):
                filtered.append(memory)
        
        return filtered
    
    def check_memory_access(self, zone: str, memory: Memory) -> Tuple[bool, Optional[str]]:
        """Check if a memory can be accessed from a zone."""
        if memory.redacted:
            return False, "Memory has been redacted"
        
        if memory.zone != zone:
            return False, f"Memory zone {memory.zone} does not match session zone {zone}"
        
        memory_tags = memory.get_tags()
        allowed_tags = self.policy.get_allowed_tags(zone)
        
        if not any(tag in allowed_tags for tag in memory_tags):
            return False, f"Memory tags {memory_tags} not allowed in zone {zone}"
        
        return True, None
    
    def validate_inference(self, zone: str, prompt: str, response: str, used_memory_ids: List[str]) -> Tuple[bool, Optional[str]]:
        """Validate inference for policy violations."""
        # Check response for disallowed patterns
        violation, reason = self.policy.check_content_violation(zone, response)
        if violation:
            return False, reason
        
        # Check if any used memories are from different zones
        from uuid import UUID
        for memory_id in used_memory_ids:
            try:
                memory_uuid = UUID(memory_id) if isinstance(memory_id, str) else memory_id
            except (ValueError, TypeError):
                return False, f"Invalid memory ID format: {memory_id}"
            memory = self.db_session.get(Memory, memory_uuid)
            if memory:
                allowed, reason = self.check_memory_access(zone, memory)
                if not allowed:
                    return False, f"Memory {memory_id} access violation: {reason}"
        
        return True, None
    
    def create_audit_record(
        self,
        session_id: str,
        prompt: str,
        response: str,
        used_memory_ids: List[str],
        policy_violation: bool = False,
        violation_reason: Optional[str] = None
    ) -> Audit:
        """Create an audit record for an inference event."""
        from uuid import UUID
        try:
            session_uuid = UUID(session_id) if isinstance(session_id, str) else session_id
        except (ValueError, TypeError):
            raise ValueError(f"Invalid session ID format: {session_id}")
        # Create provenance hash
        provenance_data = {
            "prompt": prompt,
            "response": response,
            "memory_ids": sorted(used_memory_ids),
            "timestamp": datetime.utcnow().isoformat()
        }
        provenance_hash = hashlib.sha256(
            json.dumps(provenance_data, sort_keys=True).encode()
        ).hexdigest()
        
        audit = Audit(
            session_id=session_uuid,
            prompt=prompt,
            response=response,
            used_memory_ids=json.dumps([str(mid) for mid in used_memory_ids]),
            provenance_hash=provenance_hash,
            policy_violation=policy_violation,
            violation_reason=violation_reason
        )
        
        self.db_session.add(audit)
        self.db_session.commit()
        self.db_session.refresh(audit)
        
        return audit
    
    def revoke_session(self, session_id: str, reason: Optional[str] = None) -> bool:
        """Revoke a session."""
        from uuid import UUID
        try:
            session_uuid = UUID(session_id) if isinstance(session_id, str) else session_id
        except (ValueError, TypeError):
            return False
        session = self.db_session.get(SessionModel, session_uuid)
        if not session:
            return False
        
        if session.is_revoked():
            return True  # Already revoked
        
        session.revoked_at = datetime.utcnow()
        metadata = session.get_metadata()
        metadata["revocation_reason"] = reason or "Policy violation"
        session.set_metadata(metadata)
        
        self.db_session.add(session)
        self.db_session.commit()
        
        return True
    
    def redact_memory(self, memory_id: str, reason: Optional[str] = None) -> bool:
        """Redact a memory entry."""
        from uuid import UUID
        try:
            memory_uuid = UUID(memory_id) if isinstance(memory_id, str) else memory_id
        except (ValueError, TypeError):
            return False
        memory = self.db_session.get(Memory, memory_uuid)
        if not memory:
            return False
        
        # Store original content hash before redaction
        original_hash = memory.content_hash
        
        # Redact content (replace with redaction notice)
        memory.content = f"[REDACTED - {datetime.utcnow().isoformat()}]"
        memory.redacted = True
        
        # Update content hash
        memory.content_hash = hashlib.sha256(
            f"redacted:{original_hash}:{datetime.utcnow().isoformat()}".encode()
        ).hexdigest()
        
        self.db_session.add(memory)
        self.db_session.commit()
        
        return True

