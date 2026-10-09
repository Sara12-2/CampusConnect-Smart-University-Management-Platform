from typing import TypedDict
from datetime import datetime


class ClaimModel(TypedDict):
    id: str
    itemId: str
    claimantId: int
    claimantName: str
    proof: str
    status: str
    createdAt: datetime