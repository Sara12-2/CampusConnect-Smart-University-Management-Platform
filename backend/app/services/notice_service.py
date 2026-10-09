from datetime import datetime

from app.database import notices, next_notice_id
from app.services.ai_service import generate_summary


def list_notices(
    department: str | None = None,
    semester: int | None = None,
    category: str | None = None,
    search: str | None = None,
):
    result = notices.copy()

    if department:
        result = [
            notice
            for notice in result
            if notice["department"].lower() == department.lower()
            or notice["department"].lower() == "all"
        ]

    if semester:
        result = [
            notice
            for notice in result
            if notice["semester"] is None
            or notice["semester"] == semester
        ]

    if category:
        result = [
            notice
            for notice in result
            if notice["category"] == category
        ]

    if search:
        search_text = search.lower()

        result = [
            notice
            for notice in result
            if search_text in notice["title"].lower()
            or search_text in notice["content"].lower()
        ]

    result.sort(
        key=lambda notice: (
            notice["pinned"],
            notice["createdAt"],
        ),
        reverse=True,
    )

    return result


def get_notice(notice_id: str):
    for notice in notices:
        if notice["id"] == notice_id:
            return notice

    return None


def create_notice(data: dict, author: str):
    summary = data.get("summary")

    if not summary:
        summary = generate_summary(data["content"])

    notice = {
        "id": next_notice_id(),
        "title": data["title"],
        "content": data["content"],
        "summary": summary,
        "department": data["department"],
        "semester": data.get("semester"),
        "pinned": data.get("pinned", False),
        "deadline": data.get("deadline"),
        "createdAt": datetime.utcnow(),
        "author": author,
        "category": data.get("category", "general"),
    }

    notices.append(notice)

    return notice


def update_notice(notice_id: str, data: dict):
    notice = get_notice(notice_id)

    if not notice:
        return None

    for key, value in data.items():
        if value is not None:
            notice[key] = value

    if data.get("content"):
        notice["summary"] = generate_summary(
            notice["content"]
        )

    return notice


def delete_notice(notice_id: str):
    notice = get_notice(notice_id)

    if not notice:
        return False

    notices.remove(notice)

    return True