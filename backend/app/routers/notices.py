from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, require_admin

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


# ============================================================
# List notices (public — no auth required)
# ============================================================
@router.get("", response_model=list[NoticeResponse])
def get_notices(
    department: str | None = Query(default=None),
    semester: int | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_notices(
        db,
        department=department,
        semester=semester,
        category=category,
        search=search,
    )


# ============================================================
# Get single notice (public)
# ============================================================
@router.get("/{notice_id}", response_model=NoticeResponse)
def get_single_notice(
    notice_id: int,
    db: Session = Depends(get_db),
):
    notice = get_notice(db, notice_id)
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found",
        )
    return notice


# ============================================================
# Create notice (admin only)
# ============================================================
@router.post("", response_model=NoticeResponse)
def create_new_notice(
    data: NoticeCreate,
    admin: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    # ✅ Pass both author name AND author_id
    return create_notice(
        db,
        data,
        author=admin["name"],
        author_id=int(admin["id"]),
    )


# ============================================================
# Update notice (admin only)
# ============================================================
@router.put("/{notice_id}", response_model=NoticeResponse)
def edit_notice(
    notice_id: int,
    data: NoticeUpdate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    notice = update_notice(db, notice_id, data)
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found",
        )
    return notice


# ============================================================
# Delete notice (admin only)
# ============================================================
@router.delete("/{notice_id}")
def remove_notice(
    notice_id: int,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    deleted = delete_notice(db, notice_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found",
        )
    return {"message": "Notice deleted successfully"}