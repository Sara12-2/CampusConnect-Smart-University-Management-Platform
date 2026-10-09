from fastapi import APIRouter, Depends, Query

from app.routers.auth import (
    get_current_user,
    require_admin,
)

from app.schemas.lost_found import (
    LostFoundCreate,
    LostFoundResponse,
    LostFoundUpdate,
)

from app.services.lost_found_service import (
    create_item,
    delete_item,
    get_item,
    list_items,
    update_item,
)


router = APIRouter(
    prefix="/api/lost-found",
    tags=["Lost & Found"],
)


@router.get(
    "",
    response_model=list[LostFoundResponse],
)
def get_items(
    item_type: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
):

    return list_items(
        item_type,
        status,
        search,
    )


@router.get(
    "/{item_id}",
    response_model=LostFoundResponse,
)
def get_single_item(
    item_id: str,
):

    return get_item(item_id)


@router.post(
    "",
    response_model=LostFoundResponse,
)
def create_new_item(
    data: LostFoundCreate,
    user: dict = Depends(get_current_user),
):

    return create_item(
        data,
        user,
    )


@router.put(
    "/{item_id}",
    response_model=LostFoundResponse,
)
def edit_item(
    item_id: str,
    data: LostFoundUpdate,
    _: dict = Depends(require_admin),
):

    return update_item(
        item_id,
        data,
    )


@router.delete(
    "/{item_id}",
)
def remove_item(
    item_id: str,
    _: dict = Depends(require_admin),
):

    delete_item(item_id)

    return {
        "message": "Lost & Found item deleted successfully"
    }