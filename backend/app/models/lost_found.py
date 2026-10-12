from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class LostFound(Base):
    __tablename__ = "lost_found"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String(10), nullable=False, index=True)  # lost / found
    location = Column(String(255), nullable=True)
    status = Column(String(20), default="open", nullable=False, index=True)
    image_url = Column(String(500), nullable=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="lost_found_items")
    claims = relationship(
        "Claim",
        back_populates="item",
        cascade="all, delete-orphan",
    )
