from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserResponse,
    TokenResponse,
)
from app.services.auth_service import (
    authenticate_user,
    get_user_by_id,
    register_user,
    public_user,
)
from app.utils.security import create_access_token, decode_access_token


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if not isinstance(payload, dict):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID",
        )

    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


def require_admin(
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(payload: UserRegister):
    # Public registration only creates student accounts.
    # Do not trust user-supplied roles.
    user_data = payload.model_dump()
    user_data["role"] = "student"

    user = register_user(user_data)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    return public_user(user)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(payload: UserLogin):
    user = authenticate_user(
        payload.email,
        payload.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user["role"] != payload.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Selected role does not match account role",
        )

    token = create_access_token(
        {"sub": str(user["id"])}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": public_user(user),
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: dict = Depends(get_current_user),
):
    return public_user(current_user)