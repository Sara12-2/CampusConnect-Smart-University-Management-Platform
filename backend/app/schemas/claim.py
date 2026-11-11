from typing import Literal
from datetime import datetime
from pydantic import BaseModel, Field


class ClaimCreate(BaseModel):
    itemId: int  # <-- int banaya
    message: str = Field(..., min_length=5)  # <-- proof ki jagah message


class ClaimUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected"]


class ClaimResponse(BaseModel):
    id: int  # <-- int
    itemId: int  # <-- int
    claimantId: int
    message: str  # <-- proof ki jagah message
    status: Literal["pending", "approved", "rejected"]
    createdAt: datetime

    class Config:
        from_attributes = True