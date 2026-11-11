import enum

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    STAFF = "staff"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)  # ← renamed
    name = Column(String(255), nullable=False)  # ← renamed from full_name

    role = Column(
        Enum(UserRole, name="user_role"),
        default=UserRole.STUDENT,
        nullable=False,
    )

    is_active = Column(Boolean, default=True, nullable=False)

    department = Column(String(100), nullable=True)
    semester = Column(Integer, nullable=True)  # ← int (was string)
    phone = Column(String(20), nullable=True)
    avatar = Column(String(500), nullable=True)  # ← renamed from avatar_url

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
    )

    # Relationships
    notices = relationship(
        "Notice",
        back_populates="author",
        cascade="all, delete-orphan",
    )
    complaints = relationship(
        "Complaint",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    lost_found_items = relationship(
        "LostFound",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    claims = relationship(
        "Claim",
        back_populates="claimant",
        cascade="all, delete-orphan",
    )