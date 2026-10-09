from typing import TypedDict, Optional
from datetime import datetime


class NoticeModel(TypedDict):
    id: str
    title: str
    content: str
    summary: Optional[str]
    department: str
    semester: Optional[int]
    pinned: bool
    deadline: Optional[str]
    createdAt: datetime
    author: str
    category: str