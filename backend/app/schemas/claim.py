from typing import Literal
from datetime import datetime

from pydantic import BaseModel, Field


class ClaimCreate(BaseModel):
    itemId: str
    proof: str = Field(..., min_length=5)


class ClaimUpdate(BaseModel):
    status: Literal[
        "pending",
        "approved",
        "rejected",
    ]


class ClaimResponse(BaseModel):
    id: str
    itemId: str
    claimantId: int
    claimantName: str
    proof: str
    status: Literal[
        "pending",
        "approved",
        "rejected",
    ]
    createdAt: datetime