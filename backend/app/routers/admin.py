from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field

from app.database import get_db
from app.models.user import User
from app.models.notice import Notice
from app.models.complaint import Complaint
from app.models.lost_found import LostFound
from app.models.claim import Claim
from app.models.staff import Staff
from app.routers.auth import require_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)

# ============================================================
# PYDANTIC SCHEMAS (Request Body)
# ============================================================
class StaffCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
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


# ============================================================
# STATS
# ============================================================
@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    return {
        "users": db.query(User).count(),
        "notices": db.query(Notice).count(),
        "complaints": db.query(Complaint).count(),
        "lostFound": db.query(LostFound).count(),
        "claims": db.query(Claim).count(),
        "staff": db.query(Staff).count(),
        "pendingComplaints": db.query(Complaint).filter(Complaint.status != "resolved").count(),
        "pendingClaims": db.query(Claim).filter(Claim.status == "pending").count(),
    }


# ============================================================
# USERS
# ============================================================
@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role.value if hasattr(u.role, "value") else u.role,
            "department": u.department,
            "is_active": u.is_active,
        }
        for u in users
    ]

@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    # Cannot deactivate the last remaining active admin
    if (str(user.role) == "admin" or user.role.value == "admin") and user.is_active and not data.is_active:
        active_admins = db.query(User).filter(
            User.role == user.role, 
            User.is_active == True
        ).count()
        if active_admins <= 1:
            raise HTTPException(400, "Cannot deactivate the last active admin")

    user.is_active = data.is_active
    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value if hasattr(user.role, "value") else user.role,
            "is_active": user.is_active,
        },
    }


# ============================================================
# STAFF CRUD
# ============================================================
@router.get("/staff")
def get_staff(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    staff_members = db.query(Staff).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "role": s.role,
            "department": s.department,
            "is_active": s.is_active,
        }
        for s in staff_members
    ]

@router.post("/staff")
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    # Check if email already exists
    if db.query(Staff).filter(Staff.email == data.email).first():
        raise HTTPException(400, "Email already registered for staff")

    member = Staff(
        name=data.name,
        email=data.email,
        department=data.department,
        role=data.designation,  # mapping Pydantic field to DB column
        is_active=True
    )
    db.add(member)
    db.commit()
    db.refresh(member)

    return {
        "id": member.id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
        "department": member.department,
        "is_active": member.is_active,
    }

@router.put("/staff/{staff_id}")
def edit_staff(
    staff_id: int,
    data: StaffUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    member = db.query(Staff).filter(Staff.id == staff_id).first()
    if not member:
        raise HTTPException(404, "Staff member not found")

    update_data = data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "designation":
            setattr(member, "role", value)
        elif hasattr(member, key):
            setattr(member, key, value)

    db.commit()
    db.refresh(member)

    return {
        "id": member.id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
        "department": member.department,
        "is_active": member.is_active,
    }

@router.delete("/staff/{staff_id}")
def remove_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    member = db.query(Staff).filter(Staff.id == staff_id).first()
    if not member:
        raise HTTPException(404, "Staff member not found")

    db.delete(member)
    db.commit()

    return {"message": "Staff member deleted successfully"}