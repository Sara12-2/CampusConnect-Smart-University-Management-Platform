from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, Field


# ============================================================
# Base
# ============================================================
class LostFoundBase(BaseModel):
    type: Literal["lost", "found"]
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    location: Optional[str] = None
    imageUrl: Optional[str] = None  # ✅ matches model.image_url


# ============================================================
# Create
# ============================================================
class LostFoundCreate(LostFoundBase):
    pass


# ============================================================
# Update
# ============================================================
class LostFoundUpdate(BaseModel):
    type: Optional[Literal["lost", "found"]] = None
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, min_length=10)
    location: Optional[str] = None
    imageUrl: Optional[str] = None
    status: Optional[Literal["open", "claimed", "returned"]] = None


# ============================================================
# Response
# ============================================================
class LostFoundResponse(BaseModel):
    id: int  # ✅ matches model.id (Integer)
    title: str
    description: str
    type: Literal["lost", "found"]
    location: Optional[str] = None
    status: Literal["open", "claimed", "returned"]
    imageUrl: Optional[str] = None
    reporterId: int  # ✅ matches service output
    createdAt: datetime

    class Config:
        from_attributes = True