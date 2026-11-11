from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class NotificationCreate(BaseModel):
    title: str
    message: str
    link: Optional[str] = None


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    isRead: bool
    link: Optional[str] = None
    userId: int
    createdAt: datetime

    class Config:
        from_attributes = True