from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)

import app.database as database


claims = getattr(database, "claims")
complaints = getattr(database, "complaints")
lost_found_items = getattr(database, "lost_found_items")
notices = getattr(database, "notices")
staff = getattr(database, "staff")
users = getattr(database, "users")
next_staff_id = getattr(database, "next_staff_id")

from app.routers.auth import require_admin


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


class StaffCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    email: EmailStr

    department: str = "General"

    designation: str = "Staff"


class StaffUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    department: str | None = None
    designation: str | None = None
    is_active: bool | None = None

class UserStatusUpdate(BaseModel):
    is_active: bool


@router.get("/users")
def get_users(
    _: dict = Depends(require_admin),
):
    # Passwords kabhi API response mein return na hon.
    safe_users = []

    for user in users:
        safe_user = {
            key: value
            for key, value in user.items()
            if key not in ("password", "hashed_password")
        }
        safe_users.append(safe_user)

    return safe_users


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UserStatusUpdate,
    current_admin: dict = Depends(require_admin),
):
    user = next(
        (user for user in users if user.get("id") == user_id),
        None,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # Cannot deactivate the last remaining active admin.
    if (
        user.get("role") == "admin"
        and user.get("is_active", True)
        and not data.is_active
    ):
        active_admins = [
            item for item in users
            if item.get("role") == "admin"
            and item.get("is_active", True)
        ]

        if len(active_admins) <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot deactivate the last active admin",
            )

    user["is_active"] = data.is_active

    return {
        "message": "User status updated successfully",
        "user": {
            key: value
            for key, value in user.items()
            if key not in ("password", "hashed_password")
        },
    }
    
@router.get("/stats")
def get_stats(
    _: dict = Depends(require_admin),
):

    return {
        "users": len(users),
        "notices": len(notices),
        "complaints": len(complaints),
        "lostFound": len(lost_found_items),
        "claims": len(claims),
        "staff": len(staff),
        "pendingComplaints": sum(
            1
            for complaint in complaints
            if complaint["status"] != "resolved"
        ),
        "pendingClaims": sum(
            1
            for claim in claims
            if claim["status"] == "pending"
        ),
    }


@router.get("/staff")
def get_staff(
    _: dict = Depends(require_admin),
):

    return staff


@router.post("/staff")
def create_staff(
    data: StaffCreate,
    _: dict = Depends(require_admin),
):

    member = {
        "id": next_staff_id(),
        **data.model_dump(),
        "is_active": True,
    }

    staff.append(member)

    return member


@router.put("/staff/{staff_id}")
def edit_staff(
    staff_id: str,
    data: StaffUpdate,
    _: dict = Depends(require_admin),
):

    member = next(
        (
            member
            for member in staff
            if member["id"] == staff_id
        ),
        None,
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Staff member not found",
        )

    changes = data.model_dump(
        exclude_unset=True
    )

    for key, value in changes.items():
        member[key] = value

    return member


@router.delete("/staff/{staff_id}")
def remove_staff(
    staff_id: str,
    _: dict = Depends(require_admin),
):

    member = next(
        (
            member
            for member in staff
            if member["id"] == staff_id
        ),
        None,
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Staff member not found",
        )

    staff.remove(member)

    return {
        "message": "Staff member deleted successfully"
    }