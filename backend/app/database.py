from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=settings.debug,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """Provide one database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create database tables for local development."""
    from app import models  # Register all models

    Base.metadata.create_all(bind=engine)


# ============================================================
# IN-MEMORY STORES (temporary)
# TODO: Migrate these services to SQLAlchemy models + real DB queries.
# These lists back the current mock service layer
# (notice_service, auth_service, complaint_service, lost_found_service,
#  claim_service, notification_service, admin router).
# ============================================================

notices = []
complaints = []
users = []
staff = []
lost_found_items = []
claims = []
notifications = []

# Aliases — different services may import under different names
lost_found = lost_found_items
notification_items = notifications


# ------------------------------------------------------------------
# ID generators for in-memory stores
# ------------------------------------------------------------------
_user_id_counter = 0
_notice_id_counter = 0
_complaint_id_counter = 0
_lost_found_id_counter = 0
_claim_id_counter = 0
_notification_id_counter = 0
_staff_id_counter = 0


def next_user_id() -> int:
    """Return the next sequential user id (in-memory only)."""
    global _user_id_counter
    _user_id_counter += 1
    return _user_id_counter


def next_notice_id() -> int:
    """Return the next sequential notice id (in-memory only)."""
    global _notice_id_counter
    _notice_id_counter += 1
    return _notice_id_counter


def next_complaint_id() -> int:
    """Return the next sequential complaint id (in-memory only)."""
    global _complaint_id_counter
    _complaint_id_counter += 1
    return _complaint_id_counter


def next_lost_found_id() -> int:
    """Return the next sequential lost_found id (in-memory only)."""
    global _lost_found_id_counter
    _lost_found_id_counter += 1
    return _lost_found_id_counter


def next_claim_id() -> int:
    """Return the next sequential claim id (in-memory only)."""
    global _claim_id_counter
    _claim_id_counter += 1
    return _claim_id_counter


def next_notification_id() -> int:
    """Return the next sequential notification id (in-memory only)."""
    global _notification_id_counter
    _notification_id_counter += 1
    return _notification_id_counter


def next_staff_id() -> int:
    """Return the next sequential staff id (in-memory only)."""
    global _staff_id_counter
    _staff_id_counter += 1
    return _staff_id_counter