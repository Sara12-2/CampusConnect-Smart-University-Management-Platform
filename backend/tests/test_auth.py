def test_register_and_login(client):
    response = client.post("/api/auth/register", json={"name": "New Student", "email": "new@student.local", "password": "StrongPass123!", "role": "admin"})
    assert response.status_code == 200, response.text
    assert response.json()["role"] == "student"  # public registration cannot grant admin
    login = client.post("/api/auth/login", json={"email": "new@student.local", "password": "StrongPass123!", "role": "student"})
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_invalid_login_is_rejected(client):
    response = client.post("/api/auth/login", json={"email": "missing@student.local", "password": "wrongpass", "role": "student"})
    assert response.status_code == 401
