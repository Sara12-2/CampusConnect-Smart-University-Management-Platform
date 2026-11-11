"""
Model registry — importing this module registers all SQLAlchemy models
with the shared Base class, so `Base.metadata.create_all()` creates
every table.

⚠️ Import order matters: models with no foreign keys come first.
"""

# Base first (from database)
# (individual model files already import Base from app.database)

from app.models.department import Department
from app.models.user import User, UserRole
from app.models.staff import Staff
from app.models.notice import Notice
from app.models.complaint import Complaint
from app.models.lost_found import LostFound
from app.models.claim import Claim
from app.models.notification import Notification


__all__ = [
    "User",
    "UserRole",
    "Department",
    "Staff",
    "Notice",
    "Complaint",
    "LostFound",
    "Claim",
    "Notification",
]