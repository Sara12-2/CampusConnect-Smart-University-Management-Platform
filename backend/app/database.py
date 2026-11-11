from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings


# ============================================================
# SQLAlchemy engine
# ============================================================
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=settings.db_echo,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# ============================================================
# Database dependency (FastAPI)
# ============================================================
def get_db():
    """Provide one database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# Table creation
# ============================================================
def init_db():
    """Create database tables for local development."""
    from app import models  # Register all models

    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized")