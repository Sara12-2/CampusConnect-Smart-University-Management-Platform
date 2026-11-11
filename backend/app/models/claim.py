from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)

    item_id = Column(
        Integer,
        ForeignKey("lost_found.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    claimant_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    message = Column(Text, nullable=True)
    status = Column(String(20), default="pending", nullable=False, index=True)

    # ← ADDED: track who verified
    verified_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # ← ADDED

    item = relationship("LostFound", back_populates="claims")
    claimant = relationship("User", back_populates="claims", foreign_keys=[claimant_id])
    verifier = relationship("User", foreign_keys=[verified_by])  # ← ADDED