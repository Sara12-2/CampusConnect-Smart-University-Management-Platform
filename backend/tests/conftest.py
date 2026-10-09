import pytest  # type: ignore[import-not-found]
from fastapi.testclient import TestClient

from app.main import app
from app import database
from app.utils.security import hash_password


@pytest.fixture(autouse=True)
def reset_memory_store():
    for name in ("users", "notices", "complaints", "lost_found_items", "claims", "notifications", "staff"):
        getattr(database, name).clear()
    yield
    for name in ("users", "notices", "complaints", "lost_found_items", "claims", "notifications", "staff"):
        getattr(database, name).clear()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def admin_user():
    user = {"id": 9001, "name": "Test Admin", "email": "admin@test.local", "password": hash_password("StrongPass123!"), "role": "admin", "department": None, "semester": None, "avatar": None, "is_active": True}
    database.users.append(user)
    return user


@pytest.fixture
def student_user():
    user = {"id": 9002, "name": "Test Student", "email": "student@test.local", "password": hash_password("StudentPass123!"), "role": "student", "department": "Computer Science", "semester": 2, "avatar": None, "is_active": True}
    database.users.append(user)
    return user


def login(client, email, password, role):
    response = client.post("/api/auth/login", json={"email": email, "password": password, "role": role})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture
def admin_headers(client, admin_user):
    return login(client, admin_user["email"], "StrongPass123!", "admin")


@pytest.fixture
def student_headers(client, student_user):
    return login(client, student_user["email"], "StudentPass123!", "student")
