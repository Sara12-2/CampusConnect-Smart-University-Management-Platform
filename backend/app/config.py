from pathlib import Path
# pyrefly: ignore[missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    app_name: str = "CampusConnect API"
    app_version: str = "1.0.0"
    debug: bool = False

    database_url: str = "postgresql+psycopg2://campusconnect_user:campusconnect_dev_pass@localhost:5432/campusconnect"
    secret_key: str = ""
    db_echo: bool = False
    access_token_expire_minutes: int = 60

    upload_dir: str = str(BACKEND_DIR / "uploads")
    max_upload_size_mb: int = 10

    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-20b"
    gemini_api_key: str = ""
    chroma_dir: str = str(BACKEND_DIR / "vector_store")
    ai_model: str = "openai/gpt-oss-20b"
    embedding_model: str = "gemini-embedding-001"

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH) if ENV_PATH.exists() else ".env",
        extra="ignore",
    )

settings = Settings()