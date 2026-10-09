from fastapi import (
    APIRouter,
    Depends,
)

from app.routers.auth import (
    get_current_user,
    require_admin,
)

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


@router.get(
    "",
    response_model=list[NotificationResponse],
)
def get_notifications(
    user: dict = Depends(get_current_user),
):

    return list_notifications(
        str(user["id"])
    )


@router.post(
    "",
    response_model=NotificationResponse,
)
def create_new_notification(
    data: NotificationCreate,
    _: dict = Depends(require_admin),
):

    return create_notification(data)


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def read_notification(
    notification_id: str,
    user: dict = Depends(get_current_user),
):

    return mark_read(
        notification_id,
        str(user["id"]),
    )