"""Configuration settings for the application."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_key: str = "dev-demo-key-change-in-production"
    api_key_header: str = "X-API-Key"
    
    # Database
    database_url: str = "sqlite:///./clinical_triage.db"
    
    # LLM Provider Selection
    llm_provider: str = "openai"  # Options: "openai" or "gemini"
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-3.5-turbo"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 500
    
    # Google Gemini Configuration
    gemini_api_key: Optional[str] = None  # Also accepts GOOGLE_API_KEY env var
    google_api_key: Optional[str] = None  # Standard env var for Google APIs
    gemini_model: str = "gemini-pro"
    gemini_temperature: float = 0.7
    gemini_max_tokens: int = 500
    
    # LCAC Configuration
    trust_score_initial: float = 1.0
    trust_score_violation_penalty: float = 0.2
    trust_score_success_bonus: float = 0.05
    trust_score_min: float = 0.0
    trust_score_max: float = 1.0
    
    # Security
    encryption_key: Optional[str] = None  # For content encryption (optional in MVP)
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()