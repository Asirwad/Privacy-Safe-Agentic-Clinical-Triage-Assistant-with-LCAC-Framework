"""Orchestrator for LangChain agent with LCAC pre/post hooks."""

from typing import List, Dict, Optional, Tuple
from sqlmodel import Session
try:
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
except ImportError:
    # Fallback for older langchain versions
    from langchain.schema import HumanMessage, SystemMessage, AIMessage

# LLM Provider imports
try:
    from langchain_openai import ChatOpenAI
except ImportError:
    ChatOpenAI = None

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:
    ChatGoogleGenerativeAI = None

from backend.lcac import LCACEngine
from backend.trust import TrustEngine
from backend.models import Memory, Session as SessionModel
from backend.config import settings
import hashlib
import json


class TriageOrchestrator:
    """Orchestrator that manages agent execution with LCAC enforcement."""
    
    def __init__(self, db_session: Session):
        self.db_session = db_session
        self.lcac = LCACEngine(db_session)
        self.trust_engine = TrustEngine(db_session)
        self.llm = None
        self.llm_provider = settings.llm_provider.lower()
        
        # Initialize LLM based on provider
        if self.llm_provider == "openai":
            self.llm = self._init_openai_llm()
        elif self.llm_provider == "gemini":
            self.llm = self._init_gemini_llm()
        else:
            print(f"Warning: Unknown LLM provider '{self.llm_provider}'. Supported: 'openai', 'gemini'")
            # Try to auto-detect based on available API keys
            if settings.openai_api_key:
                self.llm = self._init_openai_llm()
                self.llm_provider = "openai"
            elif settings.gemini_api_key:
                self.llm = self._init_gemini_llm()
                self.llm_provider = "gemini"
    
    def _init_openai_llm(self):
        """Initialize OpenAI LLM."""
        if not settings.openai_api_key:
            print("Warning: OpenAI API key not set. Set OPENAI_API_KEY environment variable.")
            return None
        
        if ChatOpenAI is None:
            print("Warning: langchain-openai not installed. Install with: pip install langchain-openai")
            return None
        
        try:
            return ChatOpenAI(
                model=settings.openai_model,
                temperature=settings.openai_temperature,
                max_tokens=settings.openai_max_tokens,
                openai_api_key=settings.openai_api_key
            )
        except Exception as e:
            print(f"Warning: Failed to initialize OpenAI LLM: {e}")
            return None
    
    def _init_gemini_llm(self):
        """Initialize Google Gemini LLM."""
        import os
        
        # Check for API key in settings or environment (GOOGLE_API_KEY is the standard env var)
        api_key = settings.gemini_api_key or os.getenv("GOOGLE_API_KEY")
        
        if not api_key:
            print("Warning: Gemini API key not set. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.")
            return None
        
        if ChatGoogleGenerativeAI is None:
            print("Warning: langchain-google-genai not installed. Install with: pip install langchain-google-genai")
            return None
        
        try:
            # ChatGoogleGenerativeAI reads from GOOGLE_API_KEY env var by default
            # If we have it in settings, set it as env var so LangChain can pick it up
            if settings.gemini_api_key and not os.getenv("GOOGLE_API_KEY"):
                os.environ["GOOGLE_API_KEY"] = settings.gemini_api_key
            
            return ChatGoogleGenerativeAI(
                model=settings.gemini_model,
                temperature=settings.gemini_temperature,
                max_output_tokens=settings.gemini_max_tokens
            )
        except Exception as e:
            print(f"Warning: Failed to initialize Gemini LLM: {e}")
            return None
    
    def _build_context_from_memories(self, memories: List[Memory]) -> str:
        """Build context string from memories."""
        if not memories:
            return "No relevant patient history available."
        
        context_parts = []
        for memory in memories:
            context_parts.append(f"- {memory.content} (tags: {', '.join(memory.get_tags())})")
        
        return "\n".join(context_parts)
    
    def _build_system_prompt(self, zone: str) -> str:
        """Build system prompt based on zone."""
        zone_prompts = {
            "triage": """You are a clinical triage assistant. Your role is to:
1. Ask clarifying questions about the patient's symptoms
2. Assess the urgency of the situation
3. Provide triage recommendations (urgent, non-urgent, emergency)
4. Only use information from the provided patient context

Important: You must NOT reference information outside of the provided context.
Do not mention radiology results, billing information, or other restricted data.""",
            "teleconsult": """You are a teleconsultation assistant. Your role is to:
1. Conduct a virtual consultation
2. Gather patient history and symptoms
3. Provide preliminary recommendations
4. Only use information from the provided patient context.""",
            "billing": """You are a billing assistant. Your role is to:
1. Help with billing codes and insurance questions
2. Only use information from the provided patient context.""",
        }
        
        return zone_prompts.get(zone, "You are a clinical assistant. Use only the provided context.")
    
    def _pre_inference_hook(self, session_id: str, prompt: str) -> Tuple[List[Memory], bool, Optional[str]]:
        """LCAC pre-inference hook: validate session and gather allowed memories."""
        from uuid import UUID
        try:
            session_uuid = UUID(session_id) if isinstance(session_id, str) else session_id
        except (ValueError, TypeError):
            return [], False, "Invalid session ID format"
        # Check if session exists and is not revoked
        session = self.db_session.get(SessionModel, session_uuid)
        if not session:
            return [], False, "Session not found"
        
        if session.is_revoked():
            return [], False, "Session has been revoked"
        
        # Get allowed memories for the zone
        allowed_memories = self.lcac.get_allowed_memories(session.zone, session.user_id)
        
        return allowed_memories, True, None
    
    def _post_inference_hook(
        self,
        session_id: str,
        prompt: str,
        response: str,
        used_memory_ids: List[str]
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """LCAC post-inference hook: validate response for policy violations."""
        from uuid import UUID
        try:
            session_uuid = UUID(session_id) if isinstance(session_id, str) else session_id
        except (ValueError, TypeError):
            return False, None, "Invalid session ID format"
        session = self.db_session.get(SessionModel, session_uuid)
        if not session:
            return False, None, "Session not found"
        
        # Validate inference
        is_valid, violation_reason = self.lcac.validate_inference(
            session.zone,
            prompt,
            response,
            used_memory_ids
        )
        
        if not is_valid:
            # Record violation
            self.trust_engine.record_violation(session.user_id, violation_reason)
            
            # Revoke session if violation is severe
            self.lcac.revoke_session(session_id, violation_reason)
            
            return False, violation_reason, "Session revoked due to policy violation"
        
        # Record success
        self.trust_engine.record_success(session.user_id)
        
        return True, None, None
    
    def process_query(self, session_id: str, message: str) -> Dict:
        """Process a query through the orchestrator with LCAC enforcement."""
        # Pre-inference hook
        allowed_memories, is_valid, error = self._pre_inference_hook(session_id, message)
        
        if not is_valid:
            return {
                "success": False,
                "error": error,
                "response": None,
                "audit_id": None,
                "used_memory_ids": []
            }
        
        # Build context from memories
        context = self._build_context_from_memories(allowed_memories)
        
        # Get session for zone
        from uuid import UUID
        try:
            session_uuid = UUID(session_id) if isinstance(session_id, str) else session_id
        except (ValueError, TypeError):
            return {
                "success": False,
                "error": "Invalid session ID format",
                "response": None,
                "audit_id": None
            }
        session = self.db_session.get(SessionModel, session_uuid)
        if not session:
            return {
                "success": False,
                "error": "Session not found",
                "response": None,
                "audit_id": None
            }
        system_prompt = self._build_system_prompt(session.zone)
        
        # Build full prompt
        full_prompt = f"""{system_prompt}

Patient Context:
{context}

User Query: {message}

Please provide a helpful response based on the patient context above. Do not reference any information outside of the provided context."""
        
        # Call LLM
        try:
            if not self.llm:
                # Fallback response if LLM not configured
                provider_name = "OpenAI" if self.llm_provider == "openai" else "Gemini"
                api_key_var = "OPENAI_API_KEY" if self.llm_provider == "openai" else "GEMINI_API_KEY"
                response = f"LLM not configured. Please set {api_key_var} environment variable for {provider_name}."
            else:
                # Build messages - handle system message differently for Gemini
                if self.llm_provider == "gemini":
                    # Gemini doesn't use SystemMessage the same way, so we include it in the user message
                    user_content = f"{system_prompt}\n\nPatient Context:\n{context}\n\nUser Query: {message}"
                    messages = [HumanMessage(content=user_content)]
                else:
                    # OpenAI uses SystemMessage
                    messages = [
                        SystemMessage(content=system_prompt),
                        HumanMessage(content=f"Patient Context:\n{context}\n\nUser Query: {message}")
                    ]
                
                ai_response = self.llm.invoke(messages)
                response = ai_response.content if hasattr(ai_response, 'content') else str(ai_response)
        except Exception as e:
            response = f"Error processing query with {self.llm_provider}: {str(e)}"
        
        # Extract used memory IDs
        used_memory_ids = [str(mem.id) for mem in allowed_memories]
        
        # Post-inference hook
        is_valid, violation_reason, post_error = self._post_inference_hook(
            session_id,
            message,
            response,
            used_memory_ids
        )
        
        # Create audit record
        try:
            audit = self.lcac.create_audit_record(
                session_id=session_id,
                prompt=message,
                response=response,
                used_memory_ids=used_memory_ids,
                policy_violation=not is_valid,
                violation_reason=violation_reason
            )
            audit_id = str(audit.id)
        except Exception as e:
            # If audit creation fails, still return response but log error
            audit_id = None
            print(f"Warning: Failed to create audit record: {e}")
        
        # Determine if session was revoked
        session_revoked = (
            not is_valid and 
            post_error and 
            ("revoked" in post_error.lower() or violation_reason is not None)
        )
        
        return {
            "success": is_valid,
            "error": violation_reason or post_error,
            "response": response,
            "audit_id": audit_id,
            "used_memory_ids": used_memory_ids,
            "session_revoked": session_revoked
        }

