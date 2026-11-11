from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, require_admin
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


@router.get("", response_model=list[LostFoundResponse])
def get_items(
    item_type: str | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_items(db, item_type, status, search)


@router.get("/{item_id}", response_model=LostFoundResponse)
def get_single_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("", response_model=LostFoundResponse)
def create_new_item(
    data: LostFoundCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_item(db, data, int(user["id"]))


@router.put("/{item_id}", response_model=LostFoundResponse)
def edit_item(
    item_id: int,
    data: LostFoundUpdate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    item = update_item(db, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}")
def remove_item(
    item_id: int,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    deleted = delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Lost & Found item deleted successfully"}