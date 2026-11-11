from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, require_admin
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
)
from app.services.notification_service import (
    create_notification,
    list_notifications,
    mark_read,
)

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)


@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_notifications(db, int(user["id"]))


@router.post("", response_model=NotificationResponse)
def create_new_notification(
    data: NotificationCreate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    # Admin creates a notification for themselves or a specific user
    # Assuming data has user_id, else default to 1 (Admin)
    target_user_id = getattr(data, "user_id", 1) 
    return create_notification(db, data, target_user_id)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notif = mark_read(db, notification_id, int(user["id"]))
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif