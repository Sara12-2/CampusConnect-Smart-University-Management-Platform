from datetime import datetime

from app.database import (
    notifications,
    next_notification_id,
)


def list_notifications(user_id: int):
    result = [
        notification
        for notification in notifications
        if notification["userId"] == user_id
    ]

    result.sort(
        key=lambda notification: notification["createdAt"],
        reverse=True,
    )

    return result


def create_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str,
):
    notification = {
        "id": next_notification_id(),
        "userId": user_id,
        "title": title,
        "message": message,
        "type": notification_type,
        "read": False,
        "createdAt": datetime.utcnow(),
    }

    notifications.append(notification)

    return notification


def mark_notification_read(
    notification_id: str,
    user_id: int,
):
    for notification in notifications:
        if (
            notification["id"] == notification_id
            and notification["userId"] == user_id
        ):
            notification["read"] = True
            return notification

    return None
def mark_read(
    notification_id: str,
    user_id: int,
):
    return mark_notification_read(
        notification_id=notification_id,
        user_id=user_id,
    )