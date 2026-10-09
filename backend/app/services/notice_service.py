from datetime import datetime

from app.database import notices, next_notice_id
from app.services.ai_service import generate_summary


def _to_dict(data):
    if isinstance(data, dict):
        return data
    if hasattr(data, "model_dump"):
        return data.model_dump()
    if hasattr(data, "dict"):
        return data.dict()
    raise TypeError("Notice data must be a dictionary or Pydantic model")


def list_notices(
    department: str | None = None,
    semester: int | None = None,
    category: str | None = None,
    search: str | None = None,
):
    result = notices.copy()

    if department:
        result = [
            n for n in result
            if n["department"].lower() == department.lower()
            or n["department"].lower() == "all"
        ]

    if semester:
        result = [
            n for n in result
            if n["semester"] is None or n["semester"] == semester
        ]

    if category:
        result = [n for n in result if n["category"] == category]

    if search:
        search_text = search.lower()
        result = [
            n for n in result
            if search_text in n["title"].lower()
            or search_text in n["content"].lower()
        ]

    result.sort(
        key=lambda n: (n["pinned"], n["createdAt"]),
        reverse=True,
    )
    return result


def get_notice(notice_id: str):
    for notice in notices:
        if str(notice["id"]) == str(notice_id):
            return notice
    return None


def create_notice(data, author: str):
    data = _to_dict(data)
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


def update_notice(notice_id: str, data):
    notice = get_notice(notice_id)
    if not notice:
        return None

    data = _to_dict(data)

    for key, value in data.items():
        if value is not None:
            notice[key] = value

    if data.get("content"):
        notice["summary"] = generate_summary(notice["content"])

    return notice


def delete_notice(notice_id: str):
    notice = get_notice(notice_id)
    if not notice:
        return False

    notices.remove(notice)
    return True
