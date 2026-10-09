from fastapi import APIRouter, Depends, HTTPException

from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import (
    get_user_by_id,
    list_users,
    update_user,
)
from app.routers.auth import get_current_user, require_admin


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


@router.get("", response_model=list[UserResponse])
def get_all_users(
    current_user: dict = Depends(require_admin),
):
    return list_users()


@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: dict = Depends(get_current_user),
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    updated_user = update_user(
        current_user["id"],
        payload,
    )

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return updated_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user),
):
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user