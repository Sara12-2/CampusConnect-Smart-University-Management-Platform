from pathlib import Path
import warnings
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    # App
    app_name: str = "CampusConnect API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database — default to MySQL (most common in this project)
    # If using PostgreSQL, override in .env:
    #   DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/campusconnect
    database_url: str = "mysql+pymysql://root:password@localhost:3306/campusconnect"

    # JWT
    secret_key: str = "campusconnect-development-secret-key-change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Uploads
    upload_dir: str = str(BACKEND_DIR / "uploads")
    max_upload_size_mb: int = 10

    # AI
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-20b"
    gemini_api_key: str = ""
    chroma_dir: str = str(BACKEND_DIR / "vector_store")
    ai_model: str = "openai/gpt-oss-20b"
    embedding_model: str = "gemini-embedding-001"

    # Frontend
    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH) if ENV_PATH.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()


# ============================================================
# Startup sanity checks
# ============================================================
def validate_settings() -> list[str]:
    """Return list of warnings for missing/insecure configs."""
    warnings_list: list[str] = []

    if not settings.debug and "development-secret" in settings.secret_key:
        warnings_list.append(
            "⚠️ SECRET_KEY is still the default development value. "
            "Set a strong SECRET_KEY in .env before deploying."
        )

    if not settings.groq_api_key:
        warnings_list.append(
            "⚠️ GROQ_API_KEY is empty. The /api/chat endpoint will fail. "
            "Get a key from https://console.groq.com/keys"
        )

    if "psycopg2" in settings.database_url:
        try:
            import psycopg2  # noqa: F401
        except ImportError:
            warnings_list.append(
                "❌ DATABASE_URL uses PostgreSQL but psycopg2 is not installed. "
                "Run: pip install psycopg2-binary"
            )

    if "pymysql" in settings.database_url:
        try:
            import pymysql  # noqa: F401
        except ImportError:
            warnings_list.append(
                "❌ DATABASE_URL uses MySQL but PyMySQL is not installed. "
                "Run: pip install pymysql"
            )

    return warnings_list


def print_startup_checks() -> None:
    """Print warnings at startup."""
    for w in validate_settings():
        print(w)