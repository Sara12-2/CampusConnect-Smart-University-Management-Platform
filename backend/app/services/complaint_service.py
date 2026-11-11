import json
from datetime import datetime, timezone
from typing import Any

from app.models.complaint import Complaint


# ============================================================
# Helpers
# ============================================================

def _to_dict(data):
    """Convert dict or Pydantic model to plain dict."""
    if isinstance(data, dict):
        return data
    if hasattr(data, "model_dump"):
        return data.model_dump()
    if hasattr(data, "dict"):
        return data.dict()
    raise TypeError("Complaint data must be a dict or Pydantic model")


def _serialize(complaint: Complaint) -> dict:
    """Convert Complaint model → API response dict (camelCase)."""
    # Decode images JSON
    images = []
    if complaint.images:
        try:
            images = json.loads(complaint.images)
        except (json.JSONDecodeError, TypeError):
            images = []

    # Student name from User relation
    student_name = "Unknown"
    if complaint.user:
        student_name = complaint.user.name

    return {
        "id": complaint.id,
        "title": complaint.title,
        "description": complaint.description,
        "category": complaint.category,
        "images": images,
        "status": complaint.status,
        "studentId": complaint.user_id,
        "studentName": student_name,
        "assignedTo": complaint.assigned_to,
        "createdAt": complaint.created_at,
        "updatedAt": complaint.updated_at or complaint.created_at,
    }


# ============================================================
# List complaints (with filters)
# ============================================================

def list_complaints(
    db: Any,
    student_id: int | None = None,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
):
    query = db.query(Complaint)

    if student_id is not None:
        query = query.filter(Complaint.user_id == student_id)

    if status:
        query = query.filter(Complaint.status == status)

    if category:
        query = query.filter(Complaint.category == category)

    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.filter(
            (Complaint.title.ilike(search_pattern))
            | (Complaint.description.ilike(search_pattern))
        )

    query = query.order_by(Complaint.created_at.desc())

    return [_serialize(c) for c in query.all()]


# ============================================================
# Get single complaint
# ============================================================

def get_complaint(db: Any, complaint_id: int):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    return _serialize(complaint) if complaint else None


# ============================================================
# Create
# ============================================================

def create_complaint(db: Any, data, user: dict):
    """
    Create a complaint.
    
    Router passes:
        - data: ComplaintCreate (Pydantic model)
        - user: current user dict (from auth)
    """
    data = _to_dict(data)

    images_json = None
    if data.get("images"):
        images_json = json.dumps(data["images"])

    complaint = Complaint(
        title=data["title"],
        description=data["description"],
        category=data["category"],
        status="submitted",
        user_id=int(user["id"]),
        images=images_json,
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return _serialize(complaint)


# ============================================================
# Update
# ============================================================

def update_complaint(db: Any, complaint_id: int, data):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return None

    data = _to_dict(data)

    for key, value in data.items():
        if value is None:
            continue

        if key == "assignedTo":
            complaint.assigned_to = value
        elif key == "images":
            complaint.images = json.dumps(value) if value else None
        elif key == "status":
            if value in ("submitted", "assigned", "in-progress", "resolved"):
                complaint.status = value
        elif key in ("title", "description", "category"):
            setattr(complaint, key, value)
        # Skip unknown keys (id, createdAt, updatedAt, studentId)

    db.commit()
    db.refresh(complaint)

    return _serialize(complaint)


# ============================================================
# Delete
# ============================================================

def delete_complaint(db: Any, complaint_id: int):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        return False

    db.delete(complaint)
    db.commit()
    return True