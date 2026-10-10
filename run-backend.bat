@echo off
cd /d "%~dp0backend"
echo ====================================================
echo Starting CampusConnect Backend Server...
echo API Docs will be available at: http://localhost:8000/docs
echo ====================================================
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
call uvicorn app.main:app --reload --port 8000
pause
