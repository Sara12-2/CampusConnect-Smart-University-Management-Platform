from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_db
from app.routers import (
    admin,
    auth,
    chat,
    claims,
    complaints,
    lost_found,
    notices,
    notifications,
    uploads,
    users,
)


# ============================================================
# LIFESPAN — runs on startup and shutdown
# ============================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- Startup ----
    print("=" * 60)
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print(f"   Debug mode: {settings.debug}")
    print(f"   Database: {settings.database_url.split('@')[-1]}")
    print("=" * 60)

    # Create tables
    try:
        init_db()
    except Exception as e:
        print(f"❌ Database init failed: {e}")
        print("   Check DATABASE_URL in .env and ensure the database exists.")
        raise

    # Print config warnings
    print_startup_checks()

    # Ensure upload dir exists
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    print(f"✅ Upload directory ready: {settings.upload_dir}")

    print("=" * 60)
    print(f"✅ API ready at http://127.0.0.1:8000")
    print(f"✅ Docs at http://127.0.0.1:8000/docs")
    print("=" * 60)

    yield

    # ---- Shutdown ----
    print("👋 Shutting down CampusConnect API")


# ============================================================
# APP
# ============================================================
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)


# ============================================================
# CORS — allow local + production frontend
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        settings.frontend_url,
        # Add your Vercel URL here after frontend deploy:
        # "https://campusconnect.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STATIC FILES
# ============================================================
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

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
        "docs": "/docs",
    }


@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "ok",
        "service": "CampusConnect API",
        "version": settings.app_version,
    }


# ⚠️ NOTE: /api/chat/status is defined in app/routers/chat.py
# Do NOT duplicate it here — FastAPI would override it and cause confusion.


# ============================================================
# FAVICON — silences browser's automatic /favicon.ico request
# ============================================================
_FAVICON_PATH = Path(__file__).parent / "static" / "favicon.ico"


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    if _FAVICON_PATH.exists():
        return FileResponse(_FAVICON_PATH)
    return Response(status_code=204)