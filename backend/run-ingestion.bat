@echo off
cd /d "%~dp0"
echo ====================================================
echo Running CampusConnect ChromaDB Knowledge Ingestion...
echo ====================================================
if exist ..\.venv\Scripts\activate.bat (
    call ..\.venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
python -m scripts.ingest_chroma
echo ====================================================
pause
