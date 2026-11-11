from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings


# ============================================================
# SQLAlchemy engine
# ============================================================
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=settings.debug,
    future=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
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
_initialized = False


def init_db() -> None:
    """
    Create database tables for local development.
    Idempotent — safe to call multiple times.
    """
    global _initialized
    if _initialized:
        return

    # Import models so SQLAlchemy is aware of every table
    from app import models  # noqa: F401  (registers all models)

    Base.metadata.create_all(bind=engine)
    _initialized = True
    print("✅ Database tables initialized")


# ============================================================
# IN-MEMORY STORES (TEMPORARY)
# ============================================================
# ⚠️ These lists back the current mock service layer.
#
# ❗ TODO: Migrate each service to use SQLAlchemy models + a real DB session.
#
# Affected services:
#   - auth_service        → User
#   - notice_service      → Notice
#   - complaint_service   → Complaint
#   - lost_found_service  → LostFound
#   - claim_service       → Claim
#   - notification_service → Notification
#   - admin router        → Staff
#
# Priority order for migration:
#   1. auth_service       (login/register must be real)
#   2. notice_service     (student-facing)
#   3. complaint_service  (student-facing)
#   4. claim_service      (admin workflow)
#   5. lost_found_service (student-facing)
#   6. notification_service
#   7. admin router
# ============================================================

notices: list[dict] = []
complaints: list[dict] = []
users: list[dict] = []
staff: list[dict] = []
lost_found_items: list[dict] = []
claims: list[dict] = []
notifications: list[dict] = []

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
    global _user_id_counter
    _user_id_counter += 1
    return _user_id_counter


def next_notice_id() -> int:
    global _notice_id_counter
    _notice_id_counter += 1
    return _notice_id_counter


def next_complaint_id() -> int:
    global _complaint_id_counter
    _complaint_id_counter += 1
    return _complaint_id_counter


def next_lost_found_id() -> int:
    global _lost_found_id_counter
    _lost_found_id_counter += 1
    return _lost_found_id_counter


def next_claim_id() -> int:
    global _claim_id_counter
    _claim_id_counter += 1
    return _claim_id_counter


def next_notification_id() -> int:
    global _notification_id_counter
    _notification_id_counter += 1
    return _notification_id_counter


def next_staff_id() -> int:
    global _staff_id_counter
    _staff_id_counter += 1
    return _staff_id_counter


# ------------------------------------------------------------------
# Test helpers
# ------------------------------------------------------------------
def reset_stores() -> None:
    """Clear all in-memory stores. Use only in tests."""
    global _user_id_counter, _notice_id_counter, _complaint_id_counter
    global _lost_found_id_counter, _claim_id_counter
    global _notification_id_counter, _staff_id_counter

    notices.clear()
    complaints.clear()
    users.clear()
    staff.clear()
    lost_found_items.clear()
    claims.clear()
    notifications.clear()

    _user_id_counter = 0
    _notice_id_counter = 0
    _complaint_id_counter = 0
    _lost_found_id_counter = 0
    _claim_id_counter = 0
    _notification_id_counter = 0
    _staff_id_counter = 0