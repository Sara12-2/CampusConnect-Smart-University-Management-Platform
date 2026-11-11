from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import hash_password, verify_password


# ============================================================
# Response helpers
# ============================================================

def public_user(user: User) -> dict:
    """Convert User model → safe dict (no password)."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "department": getattr(user, "department", None),
        "semester": getattr(user, "semester", None),
        "avatar": getattr(user, "avatar", None),
        "is_active": getattr(user, "is_active", True),
    }


# ============================================================
# Lookups
# ============================================================

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def list_users(db: Session):
    return [public_user(u) for u in db.query(User).all()]


# ============================================================
# Register
# ============================================================

def register_user(db: Session, data: dict):
    """Create a new user in the database. Returns None if email exists."""
    existing = get_user_by_email(db, data["email"])
    if existing:
        return None

    user = User(
        name=data["name"],
        email=data["email"].lower(),
        password_hash=hash_password(data["password"]),
        role=data.get("role", "student"),
        department=data.get("department"),
        semester=data.get("semester"),
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return public_user(user)


# ============================================================
# Authenticate
# ============================================================

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return public_user(user)


# ============================================================
# Update
# ============================================================

def update_user(db: Session, user_id: int, data: dict):
    user = get_user_by_id(db, user_id)

    if not user:
        return None

    for key, value in data.items():
        if key == "password" and value:
            user.password_hash = hash_password(value)
        elif key == "password":
            continue
        elif value is not None and hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return public_user(user)