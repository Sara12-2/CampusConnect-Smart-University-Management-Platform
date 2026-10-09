from typing import TypedDict, Optional


class UserModel(TypedDict):
    id: int
    name: str
    email: str
    password: str
    role: str
    department: Optional[str]
    semester: Optional[int]
    avatar: Optional[str]
    is_active: bool