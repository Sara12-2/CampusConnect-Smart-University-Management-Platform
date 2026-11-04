@echo off
cd /d "%~dp0"
echo ====================================================
echo Starting CampusConnect Backend Server...
echo API Docs will be available at: http://localhost:8000/docs
echo ====================================================
if exist ..\.venv\Scripts\activate.bat (
    call ..\.venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
