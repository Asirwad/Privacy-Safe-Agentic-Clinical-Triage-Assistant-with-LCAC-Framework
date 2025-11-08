"""Database models for the application."""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import uuid4, UUID
import json


class Memory(SQLModel, table=True):
    """Memory storage with zone-based access control."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    zone: str = Field(index=True)  # e.g., "triage", "radiology", "billing"
    tags: str = Field(default="[]")  # JSON array of tags
    content: str  # Memory content (should be encrypted in production)
    content_hash: str  # Hash of content for provenance
    created_at: datetime = Field(default_factory=datetime.utcnow)
    redacted: bool = Field(default=False)
    
    def get_tags(self) -> List[str]:
        """Parse tags from JSON string."""
        try:
            return json.loads(self.tags) if self.tags else []
        except json.JSONDecodeError:
            return []
    
    def set_tags(self, tags: List[str]):
        """Set tags as JSON string."""
        self.tags = json.dumps(tags)


class Session(SQLModel, table=True):
    """Session management with zone and lifecycle tracking."""
    
    session_id: UUID = Field(default_factory=uuid4, primary_key=True)
    zone: str = Field(index=True)
    user_id: str = Field(index=True)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    revoked_at: Optional[datetime] = None
    metadata: str = Field(default="{}")  # JSON metadata
    
    def is_revoked(self) -> bool:
        """Check if session is revoked."""
        return self.revoked_at is not None
    
    def get_metadata(self) -> dict:
        """Parse metadata from JSON string."""
        try:
            return json.loads(self.metadata) if self.metadata else {}
        except json.JSONDecodeError:
            return {}
    
    def set_metadata(self, metadata: dict):
        """Set metadata as JSON string."""
        self.metadata = json.dumps(metadata)


class Audit(SQLModel, table=True):
    """Audit log for all inference events."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    session_id: UUID = Field(foreign_key="session.session_id", index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    prompt: str  # User prompt
    response: str  # Agent response
    used_memory_ids: str = Field(default="[]")  # JSON array of memory IDs
    provenance_hash: str  # Hash of prompt + response + memory_ids for integrity
    policy_violation: bool = Field(default=False)
    violation_reason: Optional[str] = None
    
    def get_used_memory_ids(self) -> List[str]:
        """Parse used memory IDs from JSON string."""
        try:
            return json.loads(self.used_memory_ids) if self.used_memory_ids else []
        except json.JSONDecodeError:
            return []
    
    def set_used_memory_ids(self, memory_ids: List[str]):
        """Set used memory IDs as JSON string."""
        self.used_memory_ids = json.dumps([str(mid) for mid in memory_ids])


class TrustScore(SQLModel, table=True):
    """Trust scores per user."""
    
    user_id: str = Field(primary_key=True, index=True)
    score: float = Field(default=1.0, ge=0.0, le=1.0)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    violation_count: int = Field(default=0)
    successful_inferences: int = Field(default=0)

