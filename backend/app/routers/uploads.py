from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)

from app.routers.auth import get_current_user

from app.utils.file_handler import save_upload


router = APIRouter(
    prefix="/api/uploads",
    tags=["Uploads"],
)


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):

    path = await save_upload(
        file,
        "general",
    )

    return {
        "filename": file.filename,
        "url": path,
        "message": "File uploaded successfully",
    }


@router.post("/complaints")
async def upload_complaint_file(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):

    path = await save_upload(
        file,
        "complaints",
    )

    return {
        "filename": file.filename,
        "url": path,
    }


@router.post("/lost-found")
async def upload_lost_found_file(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):

    path = await save_upload(
        file,
        "lost_found",
    )

    return {
        "filename": file.filename,
        "url": path,
    }


@router.post("/avatars")
async def upload_avatar(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):

    path = await save_upload(
        file,
        "avatars",
    )

    return {
        "filename": file.filename,
        "url": path,
    }