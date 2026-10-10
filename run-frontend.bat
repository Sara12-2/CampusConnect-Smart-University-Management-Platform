@echo off
cd /d "%~dp0frontend"
echo ====================================================
echo Starting CampusConnect Frontend...
echo ====================================================
call npm run dev
pause
