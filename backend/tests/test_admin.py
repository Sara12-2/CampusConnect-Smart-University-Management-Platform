def test_student_cannot_access_admin_stats(client, student_headers):
    response = client.get("/api/admin/stats", headers=student_headers)
    assert response.status_code == 403


def test_admin_can_view_stats_and_staff(client, admin_headers):
    response = client.get("/api/admin/stats", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["users"] == 1
    created = client.post("/api/admin/staff", headers=admin_headers, json={"name": "Campus Staff", "email": "staff@test.local", "department": "IT", "designation": "Support"})
    assert created.status_code == 200, created.text
    assert created.json()["email"] == "staff@test.local"


def test_admin_can_list_users_but_password_is_not_returned(client, admin_headers):
    response = client.get("/api/admin/users", headers=admin_headers)
    assert response.status_code == 200
    assert all("password" not in user for user in response.json())


def test_admin_cannot_deactivate_last_admin(client, admin_headers, admin_user):
    response = client.patch(f"/api/admin/users/{admin_user['id']}/status", headers=admin_headers, json={"is_active": False})
    assert response.status_code == 400
