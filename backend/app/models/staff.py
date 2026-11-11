from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)  # ← added index
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)

    # ← ADDED: deactivate staff
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())