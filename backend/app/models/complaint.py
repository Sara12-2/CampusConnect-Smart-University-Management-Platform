from typing import TypedDict, Optional
from datetime import datetime


class ComplaintModel(TypedDict):
    id: str
    title: str
    description: str
    category: str
    status: str
    images: list[str]
    studentId: int
    studentName: str
    assignedTo: Optional[str]
    createdAt: datetime
    updatedAt: datetime