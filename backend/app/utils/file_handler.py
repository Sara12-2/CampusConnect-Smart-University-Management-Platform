
import os
import uuid
from pathlib import Path

from fastapi import UploadFile, HTTPException

from app.config import settings


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
}


async def save_upload(
    file: UploadFile,
    subfolder: str = "",
) -> str:

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is missing",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="File type is not allowed",
        )

    max_size = settings.max_upload_size_mb * 1024 * 1024

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File size must not exceed {settings.max_upload_size_mb} MB",
        )

    base_directory = Path(settings.upload_dir).resolve()
    upload_directory = (base_directory / subfolder).resolve()

    if not upload_directory.is_relative_to(base_directory):
        raise HTTPException(
            status_code=400,
            detail="Invalid upload folder",
        )

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = upload_directory / filename

    try:
        file_path.write_bytes(content)
    except OSError:
        raise HTTPException(
            status_code=500,
            detail="Unable to save uploaded file",
        )
    finally:
        await file.close()

    relative_folder = Path(subfolder).as_posix().strip("/")
    return f"/uploads/{relative_folder}/{filename}".replace("//", "/")
