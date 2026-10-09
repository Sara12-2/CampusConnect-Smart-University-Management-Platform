from app.database import users, next_user_id
from app.utils.security import hash_password, verify_password


def public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "department": user.get("department"),
        "semester": user.get("semester"),
        "avatar": user.get("avatar"),
        "is_active": user.get("is_active", True),
    }


def get_user_by_email(email: str):
    for user in users:
        if user["email"].lower() == email.lower():
            return user
    return None


def get_user_by_id(user_id: int):
    for user in users:
        if user["id"] == user_id:
            return user
    return None


def register_user(data: dict):
    existing_user = get_user_by_email(data["email"])

    if existing_user:
        return None

    user = {
        "id": next_user_id(),
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "role": data.get("role", "student"),
        "department": data.get("department"),
        "semester": data.get("semester"),
        "avatar": None,
        "is_active": True,
    }

    users.append(user)

    return public_user(user)


def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)

    if not user:
        return None

    if not user.get("is_active", True):
        return None

    if not verify_password(password, user["password"]):
        return None

    return user


def update_user(user_id: int, data: dict):
    user = get_user_by_id(user_id)

    if not user:
        return None

    for key, value in data.items():
        if value is not None:
            user[key] = value

    return public_user(user)


def list_users():
    return [public_user(user) for user in users]