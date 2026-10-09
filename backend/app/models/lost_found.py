from typing import TypedDict
from datetime import datetime


class LostFoundModel(TypedDict):
    id: str
    type: str
    title: str
    description: str
    location: str
    date: str
    images: list[str]
    reportedBy: int
    reporterName: str
    status: str
    createdAt: datetime