from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, Field


class NoticeBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20)
    summary: Optional[str] = None
    department: str
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    pinned: bool = False
    deadline: Optional[str] = None

    category: Literal[
        "exam",
        "event",
        "fee",
        "general",
        "urgent",
    ] = "general"


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=200,
    )
    content: Optional[str] = Field(
        default=None,
        min_length=20,
    )
    summary: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    pinned: Optional[bool] = None
    deadline: Optional[str] = None

    category: Optional[
        Literal[
            "exam",
            "event",
            "fee",
            "general",
            "urgent",
        ]
    ] = None


class NoticeResponse(NoticeBase):
    id: str
    createdAt: datetime
    author: str