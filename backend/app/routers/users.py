from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User  # ✅ FIX: User model import add
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import (
    get_user_by_id,
    update_user,
    public_user,
)
from app.routers.auth import get_current_user, require_admin


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


# ============================================================
# Admin — get all users
# ============================================================
@router.get("", response_model=list[UserResponse])
def get_all_users(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    return [public_user(u) for u in users]


# ============================================================
# Current user — own profile
# ============================================================
@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: dict = Depends(get_current_user),
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated_user = update_user(
        db,
        int(current_user["id"]),
        payload.model_dump(exclude_unset=True),
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


# ============================================================
# Admin — get single user by ID
# ============================================================
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return public_user(user)