from datetime import datetime

from app.database import complaints, next_complaint_id


def list_complaints(
    student_id: int | None = None,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
):
    result = complaints.copy()

    if student_id is not None:
        result = [
            complaint
            for complaint in result
            if complaint["studentId"] == student_id
        ]

    if status:
        result = [
            complaint
            for complaint in result
            if complaint["status"] == status
        ]

    if category:
        result = [
            complaint
            for complaint in result
            if complaint["category"] == category
        ]

    if search:
        search_text = search.lower()

        result = [
            complaint
            for complaint in result
            if search_text in complaint["title"].lower()
            or search_text in complaint["description"].lower()
        ]

    result.sort(
        key=lambda complaint: complaint["createdAt"],
        reverse=True,
    )

    return result


def get_complaint(complaint_id: str):
    for complaint in complaints:
        if complaint["id"] == complaint_id:
            return complaint

    return None


def create_complaint(
    data: dict,
    student_id: int,
    student_name: str,
):
    now = datetime.utcnow()

    complaint = {
        "id": next_complaint_id(),
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "status": "submitted",
        "images": data.get("images", []),
        "studentId": student_id,
        "studentName": student_name,
        "assignedTo": None,
        "createdAt": now,
        "updatedAt": now,
    }

    complaints.append(complaint)

    return complaint


def update_complaint(
    complaint_id: str,
    data: dict,
):
    complaint = get_complaint(complaint_id)

    if not complaint:
        return None

    for key, value in data.items():
        if value is not None:
            complaint[key] = value

    complaint["updatedAt"] = datetime.utcnow()

    return complaint


def delete_complaint(complaint_id: str):
    complaint = get_complaint(complaint_id)

    if not complaint:
        return False

    complaints.remove(complaint)

    return True