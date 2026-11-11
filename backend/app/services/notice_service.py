from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.notice import Notice
from app.services.ai_service import generate_summary


def _to_dict(data):
    if isinstance(data, dict):
        return data
    if hasattr(data, "model_dump"):
        return data.model_dump()
    if hasattr(data, "dict"):
        return data.dict()
    raise TypeError("Notice data must be a dictionary or Pydantic model")


def _serialize(notice: Notice) -> dict:
    """Convert Notice model → dict (for API response)."""
    return {
        "id": notice.id,
        "title": notice.title,
        "content": notice.content,
        "summary": notice.summary,
        "department": notice.department,
        "semester": notice.semester,
        "pinned": notice.is_pinned,  # frontend expects "pinned"
        "deadline": notice.deadline.isoformat() if notice.deadline else None,
        "createdAt": notice.created_at.isoformat() if notice.created_at else None,
        "author": notice.author_name or "Admin",
        "category": notice.category,
    }


def list_notices(
    db: Session,
    department: str | None = None,
    semester: int | None = None,
    category: str | None = None,
    search: str | None = None,
):
    query = db.query(Notice)

    if department and department.lower() != "all":
        query = query.filter(
            (Notice.department == department) | (Notice.department == "All")
        )

    if semester:
        query = query.filter(
            (Notice.semester.is_(None)) | (Notice.semester == semester)
        )

    if category:
        query = query.filter(Notice.category == category)

    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.filter(
            (Notice.title.ilike(search_pattern))
            | (Notice.content.ilike(search_pattern))
        )

    query = query.order_by(Notice.is_pinned.desc(), Notice.created_at.desc())

    return [_serialize(n) for n in query.all()]


def get_notice(db: Session, notice_id: int):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    return _serialize(notice) if notice else None


def create_notice(db: Session, data, author: str = "Admin"):
    data = _to_dict(data)
    summary = data.get("summary")

    if not summary:
        summary = generate_summary(data["content"])

    notice = Notice(
        title=data["title"],
        content=data["content"],
        summary=summary,
        department=data.get("department", "All"),
        semester=data.get("semester"),
        is_pinned=data.get("pinned", False),
        deadline=data.get("deadline"),
        category=data.get("category", "general"),
        author_name=author,
    )

    db.add(notice)
    db.commit()
    db.refresh(notice)

    return _serialize(notice)


def update_notice(db: Session, notice_id: int, data):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        return None

    data = _to_dict(data)

    for key, value in data.items():
        if value is None:
            continue

        # Map API field → model field
        if key == "pinned":
            notice.is_pinned = value
        elif key == "createdAt":
            continue  # do not allow updating created_at
        elif hasattr(notice, key):
            setattr(notice, key, value)

    # Regenerate summary only if content changed AND summary not explicitly provided
    if data.get("content") and not data.get("summary"):
        notice.summary = generate_summary(notice.content)

    db.commit()
    db.refresh(notice)

    return _serialize(notice)


def delete_notice(db: Session, notice_id: int):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        return False

    db.delete(notice)
    db.commit()
    return True