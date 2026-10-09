from typing import Literal
from datetime import datetime

from pydantic import BaseModel


class NotificationCreate(BaseModel):
    userId: int
    title: str
    message: str

    type: Literal[
        "notice",
        "deadline",
        "complaint",
        "claim",
    ]


class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str

    type: Literal[
        "notice",
        "deadline",
        "complaint",
        "claim",
    ]

    read: bool
    createdAt: datetime