"""
Application configuration
"""
from pydantic_settings import BaseSettings
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings from .env"""
    
    # Server
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 20
    
    # JWT
    JWT_SECRET: str = "change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Cerebras
    CEREBRAS_API_KEY: str = ""
    CEREBRAS_MODEL: str = "llama-3.3-70b"
    CEREBRAS_BASE_URL: str = "https://api.cerebras.ai/v1"
    
    # Cartesia
    CARTESIA_API_KEY: str = ""
    CARTESIA_BASE_URL: str = "https://api.cartesia.ai"
    CARTESIA_VOICE: str = "ink-whisper"
    
    # LiveKit
    LIVEKIT_URL: str = ""
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET: str = ""
    LIVEKIT_REGION: str = "us-east-1"
    
    # Google Cloud
    GOOGLE_PROJECT_ID: str = ""
    GOOGLE_CREDENTIALS_JSON: str = "./google-credentials.json"
    GOOGLE_API_KEY: str = ""
    GOOGLE_DOCS_API_ENABLED: bool = False
    GOOGLE_DRIVE_API_ENABLED: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_CACHE_TTL: int = 3600
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_cors_origins(self) -> list:
        """Parse CORS origins from string"""
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


# Create global settings instance
settings = Settings()
logger.info("✅ Settings loaded from .env")
