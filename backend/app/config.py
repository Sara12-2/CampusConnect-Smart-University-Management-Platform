from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CampusConnect API"
    app_version: str = "1.0.0"
    debug: bool = True

    secret_key: str = "campusconnect-development-secret-key"
    access_token_expire_minutes: int = 60

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()