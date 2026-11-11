from sqlalchemy.orm import Session
from app.models.lost_found import LostFound


def _serialize(item: LostFound) -> dict:
    """Convert LostFound model → API response."""
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "type": item.type,
        "location": item.location,
        "status": item.status,
        "imageUrl": item.image_url,
        "reporterId": item.user_id,
        "createdAt": item.created_at,
    }


def list_items(
    db: Session,
    item_type: str | None = None,
    status: str | None = None,
    search: str | None = None,
):
    query = db.query(LostFound)

    if item_type:
        query = query.filter(LostFound.type == item_type)
    if status:
        query = query.filter(LostFound.status == status)
    if search:
        pattern = f"%{search.lower()}%"
        query = query.filter(
            (LostFound.title.ilike(pattern)) | (LostFound.description.ilike(pattern))
        )

    query = query.order_by(LostFound.created_at.desc())
    return [_serialize(i) for i in query.all()]


def get_item(db: Session, item_id: int):
    item = db.query(LostFound).filter(LostFound.id == item_id).first()
    return _serialize(item) if item else None


def create_item(db: Session, data, user_id: int):
    if hasattr(data, "model_dump"):
        data = data.model_dump()

    item = LostFound(
        title=data["title"],
        description=data["description"],
        type=data["type"],
        location=data.get("location"),
        image_url=data.get("imageUrl"),
        user_id=user_id,
        status="open",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize(item)


def update_item(db: Session, item_id: int, data):
    item = db.query(LostFound).filter(LostFound.id == item_id).first()
    if not item:
        return None

    if hasattr(data, "model_dump"):
        data = data.model_dump(exclude_unset=True)

    for key, value in data.items():
        if value is not None:
            if key == "imageUrl":
                item.image_url = value
            elif hasattr(item, key):
                setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return _serialize(item)


def delete_item(db: Session, item_id: int):
    item = db.query(LostFound).filter(LostFound.id == item_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True