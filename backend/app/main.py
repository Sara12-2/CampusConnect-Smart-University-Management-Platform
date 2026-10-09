from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings

from app.routers import (
    auth,
    users,
    notices,
    complaints,
    lost_found,
    claims,
    notifications,
    uploads,
    admin,
    chat,
)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount(
    "/uploads",
    StaticFiles(directory=settings.upload_dir),
    name="uploads",
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(notices.router)
app.include_router(complaints.router)
app.include_router(lost_found.router)
app.include_router(claims.router)
app.include_router(notifications.router)
app.include_router(uploads.router)
app.include_router(admin.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "message": "CampusConnect API is running",
        "version": settings.app_version,
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "CampusConnect API",
    }