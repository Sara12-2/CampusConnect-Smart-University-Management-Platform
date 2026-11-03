@echo off
cd /d "%~dp0backend"
echo ====================================================
echo Starting CampusConnect Backend Server...
echo API Docs will be available at: http://localhost:8000/docs
echo ====================================================
if exist "%~dp0.venv\Scripts\activate.bat" (
    call "%~dp0.venv\Scripts\activate.bat"
) else if exist ..\.venv\Scripts\activate.bat (
    call ..\.venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo ====================================================
    echo Installing backend dependencies...
    echo ====================================================
    pip install -r requirements.txt
)

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
