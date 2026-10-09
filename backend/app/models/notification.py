from typing import TypedDict
from datetime import datetime


class NotificationModel(TypedDict):
    id: str
    title: str
    message: str
    type: str
    read: bool
    createdAt: datetime
    userId: int