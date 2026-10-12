import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "BankPrepare AI"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "change-this-super-secret-jwt-key-min-32-chars-long-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "sqlite:///./bankprepare.db"

    # AI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # Uploads
    UPLOAD_DIR: str = os.path.join(os.getcwd(), "uploads")
    MAX_UPLOAD_SIZE_MB: int = 15

    # CORS
    # Local dev origins. In production, set FRONTEND_URL (your Vercel app URL)
    # and/or extend CORS_ORIGINS (comma-separated) on the host (Render).
    # Example: FRONTEND_URL=https://your-app.vercel.app
    FRONTEND_URL: str = ""
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip().rstrip("/") for i in v.split(",") if i.strip()]
        elif isinstance(v, str) and v.startswith("["):
            import json
            try:
                parsed = json.loads(v)
                return [str(i).strip().rstrip("/") for i in parsed if str(i).strip()]
            except Exception:
                return ["*"]
        elif isinstance(v, (list, str)):
            return v
        return ["*"]

    @property
    def allowed_origins(self) -> List[str]:
        """Local defaults + FRONTEND_URL (production Vercel origin), deduplicated."""
        origins: List[str] = list(self.CORS_ORIGINS) if isinstance(self.CORS_ORIGINS, list) else [self.CORS_ORIGINS]
        frontend = (self.FRONTEND_URL or "").strip().rstrip("/")
        if frontend and frontend not in origins:
            origins.append(frontend)
        return origins

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()
