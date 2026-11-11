from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field


# ============================================================
# Base
# ============================================================
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)


# ============================================================
# Register — NO role field (always student)
# ============================================================
class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    # ❌ NO role — auth.py forcibly sets to "student"


# ============================================================
# Login
# ============================================================
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Optional[Literal["student", "staff", "admin"]] = None


# ============================================================
# Update
# ============================================================
class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    avatar: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=6, max_length=100)


# ============================================================
# Response
# ============================================================
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Literal["student", "staff", "admin"]  # ← staff added
    department: Optional[str] = None
    semester: Optional[int] = None
    avatar: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True  # ← SQLAlchemy → Pydantic


# ============================================================
# Token
# ============================================================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse