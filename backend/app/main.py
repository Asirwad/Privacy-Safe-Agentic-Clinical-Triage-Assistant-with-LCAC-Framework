"""FastAPI application for Privacy-Safe Agentic Clinical Triage Assistant."""

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
import uvicorn

from app.database import get_session, init_db
from app.models import Memory, Session as SessionModel, Audit, TrustScore
from app.lcac import LCACEngine
from app.trust import TrustEngine
from app.orchestrator import TriageOrchestrator
from app.config import settings

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Privacy-Safe Agentic Clinical Triage Assistant",
    description="Backend API with LCAC (Least-Context Access Control) framework",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-API-Key"],
)

# API Key authentication
api_key_header = APIKeyHeader(name=settings.api_key_header, auto_error=False)


def verify_api_key(x_api_key: Optional[str] = Header(None)) -> bool:
    """Verify API key."""
    if not x_api_key or x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    return True


# Pydantic models for requests/responses
class MemoryCreate(BaseModel):
    zone: str
    tags: List[str]
    content: str


class MemoryResponse(BaseModel):
    id: str
    zone: str
    tags: List[str]
    content: str
    content_hash: str
    created_at: str
    redacted: bool


class SessionCreate(BaseModel):
    zone: str
    user_id: str
    metadata: Optional[dict] = {}


class SessionResponse(BaseModel):
    session_id: str
    zone: str
    user_id: str
    started_at: str
    revoked_at: Optional[str]
    metadata: dict


class AskRequest(BaseModel):
    session_id: str
    message: str


class AskResponse(BaseModel):
    session_id: str
    response: str
    audit_id: str
    used_memory_ids: List[str]
    success: bool
    error: Optional[str] = None
    session_revoked: bool = False


class RevokeRequest(BaseModel):
    session_id: str
    reason: Optional[str] = None


class RedactRequest(BaseModel):
    entry_id: str
    reason: Optional[str] = None


class AuditResponse(BaseModel):
    id: str
    session_id: str
    timestamp: str
    prompt: str
    response: str
    used_memory_ids: List[str]
    provenance_hash: str
    policy_violation: bool
    violation_reason: Optional[str]


class TrustResponse(BaseModel):
    user_id: str
    score: float
    last_updated: str
    violation_count: int
    successful_inferences: int


# Endpoints

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Privacy-Safe Agentic Clinical Triage Assistant API",
        "version": "0.1.0",
        "lcac": "Least-Context Access Control enabled"
    }


@app.post("/memories", response_model=MemoryResponse)
async def create_memory(
    memory_data: MemoryCreate,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Create a new memory entry."""
    import hashlib
    from datetime import datetime
    
    # Create content hash
    content_hash = hashlib.sha256(memory_data.content.encode()).hexdigest()
    
    # Create memory
    memory = Memory(
        zone=memory_data.zone,
        content=memory_data.content,
        content_hash=content_hash
    )
    memory.set_tags(memory_data.tags)
    
    session.add(memory)
    session.commit()
    session.refresh(memory)
    
    return MemoryResponse(
        id=str(memory.id),
        zone=memory.zone,
        tags=memory.get_tags(),
        content=memory.content,
        content_hash=memory.content_hash,
        created_at=memory.created_at.isoformat(),
        redacted=memory.redacted
    )


@app.get("/memories", response_model=List[MemoryResponse])
async def list_memories(
    zone: Optional[str] = None,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """List memories, filtered by zone if provided."""
    lcac = LCACEngine(session)
    
    if zone:
        # Use LCAC to get allowed memories for zone
        memories = lcac.get_allowed_memories(zone)
    else:
        # Get all non-redacted memories
        statement = select(Memory).where(Memory.redacted == False)
        memories = session.exec(statement).all()
    
    return [
        MemoryResponse(
            id=str(mem.id),
            zone=mem.zone,
            tags=mem.get_tags(),
            content=mem.content,
            content_hash=mem.content_hash,
            created_at=mem.created_at.isoformat(),
            redacted=mem.redacted
        )
        for mem in memories
    ]


@app.post("/sessions", response_model=SessionResponse)
async def create_session(
    session_data: SessionCreate,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Create a new session."""
    new_session = SessionModel(
        zone=session_data.zone,
        user_id=session_data.user_id,
        session_metadata=session_data.metadata or {}
    )
    new_session.set_metadata(session_data.metadata or {})
    
    session.add(new_session)
    session.commit()
    session.refresh(new_session)
    
    return SessionResponse(
        session_id=str(new_session.session_id),
        zone=new_session.zone,
        user_id=new_session.user_id,
        started_at=new_session.started_at.isoformat(),
        revoked_at=new_session.revoked_at.isoformat() if new_session.revoked_at else None,
        metadata=new_session.get_metadata()
    )


@app.post("/ask", response_model=AskResponse)
def ask(
    ask_request: AskRequest,
    db_session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Process a query through the orchestrator with LCAC enforcement."""
    orchestrator = TriageOrchestrator(db_session)
    
    result = orchestrator.process_query(ask_request.session_id, ask_request.message)
    
    if not result["success"] and result.get("session_revoked"):
        raise HTTPException(
            status_code=403,
            detail=f"Session revoked: {result.get('error')}"
        )
    
    return AskResponse(
        session_id=ask_request.session_id,
        response=result["response"],
        audit_id=result["audit_id"],
        used_memory_ids=result["used_memory_ids"],
        success=result["success"],
        error=result.get("error"),
        session_revoked=result.get("session_revoked", False)
    )


@app.post("/revoke")
async def revoke_session(
    revoke_request: RevokeRequest,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Revoke a session."""
    lcac = LCACEngine(session)
    
    success = lcac.revoke_session(revoke_request.session_id, revoke_request.reason)
    
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Session revoked successfully", "session_id": revoke_request.session_id}


@app.post("/redact_memory")
async def redact_memory(
    redact_request: RedactRequest,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Redact a memory entry."""
    lcac = LCACEngine(session)
    
    success = lcac.redact_memory(redact_request.entry_id, redact_request.reason)
    
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    return {"message": "Memory redacted successfully", "entry_id": redact_request.entry_id}


@app.get("/audit", response_model=List[AuditResponse])
def get_audit(
    session_id: Optional[str] = None,
    db_session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Get audit records, optionally filtered by session_id."""
    if session_id:
        try:
            session_uuid = UUID(session_id)
            statement = select(Audit).where(Audit.session_id == session_uuid).order_by(Audit.timestamp)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid session_id format")
    else:
        statement = select(Audit).order_by(Audit.timestamp)
    
    audits = db_session.exec(statement).all()
    
    # Reverse the order to get descending order (most recent first)
    audits = list(reversed(audits))
    
    return [
        AuditResponse(
            id=str(audit.id),
            session_id=str(audit.session_id),
            timestamp=audit.timestamp.isoformat(),
            prompt=audit.prompt,
            response=audit.response,
            used_memory_ids=audit.get_used_memory_ids(),
            provenance_hash=audit.provenance_hash,
            policy_violation=audit.policy_violation,
            violation_reason=audit.violation_reason
        )
        for audit in audits
    ]


@app.get("/trust", response_model=TrustResponse)
async def get_trust(
    user_id: str,
    session: Session = Depends(get_session),
    api_key: bool = Depends(verify_api_key)
):
    """Get trust score for a user."""
    trust_engine = TrustEngine(session)
    trust_score = trust_engine.get_trust_score(user_id)
    
    return TrustResponse(
        user_id=trust_score.user_id,
        score=trust_score.score,
        last_updated=trust_score.last_updated.isoformat(),
        violation_count=trust_score.violation_count,
        successful_inferences=trust_score.successful_inferences
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)