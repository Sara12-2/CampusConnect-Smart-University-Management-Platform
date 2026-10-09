from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: Literal["student", "admin"] = "student"
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)


class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Literal["student", "admin"] = "student"


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    avatar: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Literal["student", "admin"]
    department: Optional[str] = None
    semester: Optional[int] = None
    avatar: Optional[str] = None
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse