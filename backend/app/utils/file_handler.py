import os
import uuid

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

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="File type is not allowed",
        )

    upload_directory = os.path.join(
        settings.upload_dir,
        subfolder,
    )

    os.makedirs(
        upload_directory,
        exist_ok=True,
    )

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_directory,
        filename,
    )

    content = await file.read()

    max_size = (
        settings.max_upload_size_mb
        * 1024
        * 1024
    )

    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File size must be less than "
                f"{settings.max_upload_size_mb} MB"
            ),
        )

    with open(file_path, "wb") as output_file:
        output_file.write(content)

    return f"/uploads/{subfolder}/{filename}".replace(
        "//",
        "/",
    )