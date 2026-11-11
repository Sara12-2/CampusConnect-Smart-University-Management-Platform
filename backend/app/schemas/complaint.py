from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, Field


# ============================================================
# Base
# ============================================================
class ComplaintBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    category: Literal[
        "classroom", "lab", "electricity", "wifi", "furniture", "other",
    ]
    images: list[str] = []


# ============================================================
# Create
# ============================================================
class ComplaintCreate(ComplaintBase):
    pass


# ============================================================
# Update
# ============================================================
class ComplaintUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=5, max_length=200)
    description: Optional[str] = Field(default=None, min_length=10)
    category: Optional[
        Literal["classroom", "lab", "electricity", "wifi", "furniture", "other"]
    ] = None
    status: Optional[
        Literal["submitted", "assigned", "in-progress", "resolved"]
    ] = None
    images: Optional[list[str]] = None
    assignedTo: Optional[str] = None


# ============================================================
# Response
# ============================================================
class ComplaintResponse(ComplaintBase):
    id: int  # ← int
    status: Literal["submitted", "assigned", "in-progress", "resolved"]
    studentId: int  # ← int
    studentName: str
    assignedTo: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime