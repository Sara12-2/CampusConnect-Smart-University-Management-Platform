@echo off
cd /d "%~dp0"
echo ====================================================
echo Installing Chatbot Dependencies (google-genai, chromadb)
echo ====================================================
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
pip install google-genai chromadb
echo ====================================================
echo Dependencies installed successfully!
echo ====================================================
pause
