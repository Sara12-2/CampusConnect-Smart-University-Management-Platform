"""Create an administrator account interactively.

Run from the backend directory:
    python -m scripts.create_admin
"""

import sys
from pathlib import Path

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import getpass

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.services.auth_service import get_user_by_email
from app.utils.security import hash_password


def main() -> None:
    email = input("Admin email: ").strip().lower()
    name = input("Admin full name: ").strip()
    password = getpass.getpass("Admin password (minimum 8 chars): ")

    if not email or "@" not in email:
        raise SystemExit("❌ A valid email is required.")
    if not name:
        raise SystemExit("❌ Admin name is required.")
    if len(password) < 8:
        raise SystemExit("❌ Password must contain at least 8 characters.")

    db = SessionLocal()
    try:
        existing = get_user_by_email(db, email)
        if existing:
            raise SystemExit("❌ That email already exists; no account was changed.")

        admin = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role=UserRole.ADMIN,
            department=None,
            semester=None,
            avatar=None,
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(f"✅ Admin created successfully!")
        print(f"   ID:    {admin.id}")
        print(f"   Name:  {admin.name}")
        print(f"   Email: {admin.email}")
        print(f"   Role:  {admin.role.value}")
    except SystemExit:
        raise
    except Exception as exc:
        db.rollback()
        raise SystemExit(f"❌ Failed to create admin: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    main()