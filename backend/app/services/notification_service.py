from sqlalchemy.orm import Session
from app.models.notification import Notification


def _serialize(notification: Notification) -> dict:
    """Convert Notification model → API response."""
    return {
        "id": notification.id,
        "title": notification.title,
        "message": notification.message,
        "isRead": notification.is_read,
        "link": notification.link,
        "userId": notification.user_id,
        "createdAt": notification.created_at,
    }


def list_notifications(db: Session, user_id: int):
    result = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [_serialize(n) for n in result]


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "general",
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        is_read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return _serialize(notification)


def mark_notification_read(
    db: Session,
    notification_id: int,
    user_id: int,
):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .first()
    )
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return _serialize(notification)
    return None


def mark_read(
    db: Session,
    notification_id: int,
    user_id: int,
):
    return mark_notification_read(db, notification_id, user_id)