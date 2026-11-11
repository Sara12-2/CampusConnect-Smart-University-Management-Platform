from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)  # ← ADDED

    category = Column(String(50), nullable=True, index=True)
    priority = Column(String(20), default="normal", nullable=False)

    # ← ADDED these fields to match schema
    department = Column(String(100), default="All", nullable=True)
    semester = Column(Integer, nullable=True)
    is_pinned = Column(Boolean, default=False, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=True)

    is_published = Column(Boolean, default=True, nullable=False)

    # --- Added missing columns (Leader Issue Fix) ---
    summary = Column(Text, nullable=True)
    department = Column(String(100), nullable=True, default="All")
    semester = Column(Integer, nullable=True)
    pinned = Column(Boolean, default=False, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=True)

    author_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_name = Column(String(255), nullable=True)  # denormalized for response

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User", back_populates="notices")