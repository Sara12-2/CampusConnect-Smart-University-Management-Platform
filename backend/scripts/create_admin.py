"""Create an administrator account interactively.

Run from the backend directory: python -m scripts.create_admin
"""
import getpass
import os

from app.services.auth_service import get_user_by_email, register_user
from app.database import users
from app.utils.security import hash_password


def main() -> None:
    email = input("Admin email: ").strip().lower()
    name = input("Admin full name: ").strip()
    password = getpass.getpass("Admin password (minimum 8 chars): ")
    if not email or "@" not in email:
        raise SystemExit("A valid email is required.")
    if len(password) < 8:
        raise SystemExit("Password must contain at least 8 characters.")
    if get_user_by_email(email):
        raise SystemExit("That email already exists; no account was changed.")
    user = {
        "id": max((u["id"] for u in users), default=0) + 1,
        "name": name,
        "email": email,
        "password": hash_password(password),
        "role": "admin",
        "department": None,
        "semester": None,
        "avatar": None,
        "is_active": True,
    }
    users.append(user)
    print(f"Admin {email} created in the current in-memory session.")
    print("WARNING: this backend currently stores users in memory; account is lost on restart.")


if __name__ == "__main__":
    main()
