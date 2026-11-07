from datetime import datetime, timezone
from uuid import uuid4

# pyrefly: ignore [missing-import]
from fastapi import HTTPException

try:
    from app.database import notices
except Exception:
    notices = []

from app.schemas.notice import (
    NoticeCreate,
    NoticeUpdate,
)


def generate_summary(content: str) -> str:
    text = (content or "").strip()
    if not text:
        return ""

    words = text.split()
    summary = " ".join(words[:40])
    if len(words) > 40:
        summary += "..."
    return summary


def list_notices(
    department=None,
    semester=None,
    category=None,
    search=None,
):

    result = notices[:]

    if department and department != "All":
        result = [
            notice
            for notice in result
            if notice["department"] in (
                "All",
                department,
            )
        ]

    if semester is not None:
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

        query = search.lower()

        result = [
            notice
            for notice in result
            if query in notice["title"].lower()
            or query in notice["content"].lower()
        ]

    return sorted(
        result,
        key=lambda notice: (
            notice["pinned"],
            notice["createdAt"],
        ),
        reverse=True,
    )


def get_notice(notice_id: str):

    notice = next(
        (
            notice
            for notice in notices
            if notice["id"] == notice_id
        ),
        None,
    )

    if not notice:
        raise HTTPException(
            status_code=404,
            detail="Notice not found",
        )

    return notice


def create_notice(
    data: NoticeCreate,
    author: str,
):

    payload = data.model_dump()

    summary = payload["summary"].strip()

    if not summary:
        summary = generate_summary(
            payload["content"]
        )

    notice = {
        "id": str(uuid4()),
        **payload,
        "summary": summary,
        "createdAt": datetime.now(timezone.utc),
        "author": author,
    }

    notices.append(notice)

    return notice


def update_notice(
    notice_id: str,
    data: NoticeUpdate,
):

    notice = get_notice(notice_id)

    changes = data.model_dump(
        exclude_unset=True
    )

    for key, value in changes.items():
        notice[key] = value

    if (
        "content" in changes
        and not notice.get("summary")
    ):
        notice["summary"] = generate_summary(
            notice["content"]
        )

    return notice


def delete_notice(notice_id: str):

    notice = get_notice(notice_id)

    notices.remove(notice)

