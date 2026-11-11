from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, Field


# ============================================================
# Base
# ============================================================
class NoticeBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20)
    summary: Optional[str] = None
    department: str = "All"
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    pinned: bool = False
    deadline: Optional[datetime] = None  # ← datetime
    category: Literal[
        "exam", "event", "fee", "general", "urgent",
    ] = "general"
    priority: Literal["normal", "high"] = "normal"  # ← priority add


# ============================================================
# Create
# ============================================================
class NoticeCreate(NoticeBase):
    pass


# ============================================================
# Update
# ============================================================
class NoticeUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=5, max_length=200)
    content: Optional[str] = Field(default=None, min_length=20)
    summary: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    pinned: Optional[bool] = None
    deadline: Optional[datetime] = None
    category: Optional[
        Literal["exam", "event", "fee", "general", "urgent"]
    ] = None
    priority: Optional[Literal["normal", "high"]] = None


# ============================================================
# Response
# ============================================================
class NoticeResponse(NoticeBase):
    id: int  # ← int
    createdAt: datetime
    author: str