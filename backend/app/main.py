from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

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


# ============================================================
# CORS — allow local + production frontend
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Add your Vercel URL here after frontend deploy:
        # "https://campusconnect.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


<<<<<<< Updated upstream
from pathlib import Path

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

=======
# ============================================================
# STATIC FILES
# ============================================================
>>>>>>> Stashed changes
app.mount(
    "/uploads",
    StaticFiles(directory=settings.upload_dir),
    name="uploads",
)


# ============================================================
# ROUTERS
# ============================================================
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


# ============================================================
# ROOT / HEALTH
# ============================================================
@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {
        "message": "CampusConnect API is running",
        "version": settings.app_version,
    }


@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "ok",
        "service": "CampusConnect API",
    }


# ============================================================
# FAVICON — silences browser's automatic /favicon.ico request
# ============================================================
_FAVICON_PATH = Path(__file__).parent / "static" / "favicon.ico"


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    if _FAVICON_PATH.exists():
        return FileResponse(_FAVICON_PATH)
    return Response(status_code=204)