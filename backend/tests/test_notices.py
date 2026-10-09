def test_admin_can_create_notice_and_student_can_read(client, admin_headers, student_headers):
    payload = {"title": "Library timing update", "content": "The university library will remain open until eight PM during examination week.", "department": "All", "category": "general", "pinned": True}
    created = client.post("/api/notices", headers=admin_headers, json=payload)
    assert created.status_code == 200, created.text
    notice_id = created.json()["id"]
    read = client.get(f"/api/notices/{notice_id}", headers=student_headers)
    assert read.status_code == 200
    assert read.json()["title"] == payload["title"]


def test_student_cannot_create_notice(client, student_headers):
    payload = {"title": "Library timing update", "content": "The university library will remain open until eight PM during examination week.", "department": "All", "category": "general"}
    response = client.post("/api/notices", headers=student_headers, json=payload)
    assert response.status_code == 403
