from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, Field


class LostFoundBase(BaseModel):
    type: Literal["lost", "found"]
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    location: str
    date: str
    images: list[str] = []


class LostFoundCreate(LostFoundBase):
    pass


class LostFoundUpdate(BaseModel):
    type: Optional[Literal["lost", "found"]] = None

    title: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    description: Optional[str] = Field(
        default=None,
        min_length=10,
    )

    location: Optional[str] = None
    date: Optional[str] = None
    images: Optional[list[str]] = None

    status: Optional[
        Literal[
            "open",
            "claimed",
            "returned",
        ]
    ] = None


class LostFoundResponse(LostFoundBase):
    id: str
    reportedBy: int
    reporterName: str
    status: Literal[
        "open",
        "claimed",
        "returned",
    ]
    createdAt: datetime