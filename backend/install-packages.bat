@echo off
cd /d "%~dp0"
echo ====================================================
echo Installing Chatbot Dependencies (google-genai, chromadb)
echo ====================================================
if exist ..\.venv\Scripts\activate.bat (
    call ..\.venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
pip install -r requirements.txt
echo ====================================================
echo Dependencies installed successfully!
echo ====================================================
pause
