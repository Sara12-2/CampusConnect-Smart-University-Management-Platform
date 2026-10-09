from fastapi import APIRouter, Depends, Query

from app.routers.auth import (
    require_admin,
)

from app.schemas.notice import (
    NoticeCreate,
    NoticeResponse,
    NoticeUpdate,
)

from app.services.notice_service import (
    create_notice,
    delete_notice,
    get_notice,
    list_notices,
    update_notice,
)


router = APIRouter(
    prefix="/api/notices",
    tags=["Notices"],
)


@router.get(
    "",
    response_model=list[NoticeResponse],
)
def get_notices(
    department: str | None = Query(default=None),
    semester: int | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
):

    return list_notices(
        department,
        semester,
        category,
        search,
    )


@router.get(
    "/{notice_id}",
    response_model=NoticeResponse,
)
def get_single_notice(
    notice_id: str,
):

    return get_notice(notice_id)


@router.post(
    "",
    response_model=NoticeResponse,
)
def create_new_notice(
    data: NoticeCreate,
    admin: dict = Depends(require_admin),
):

    return create_notice(
        data,
        admin["name"],
    )


@router.put(
    "/{notice_id}",
    response_model=NoticeResponse,
)
def edit_notice(
    notice_id: str,
    data: NoticeUpdate,
    _: dict = Depends(require_admin),
):

    return update_notice(
        notice_id,
        data,
    )


@router.delete(
    "/{notice_id}",
)
def remove_notice(
    notice_id: str,
    _: dict = Depends(require_admin),
):

    delete_notice(notice_id)

    return {
        "message": "Notice deleted successfully"
    }