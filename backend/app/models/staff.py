from typing import TypedDict


class StaffModel(TypedDict):
    id: str
    name: str
    email: str
    department: str
    designation: str
    is_active: bool