@echo off
echo === Pebble MVP - Starting Full Stack ===
echo.

:: Start backend in a new window
echo [1/2] Starting backend (Python 3.11 + FastAPI)...
start "Pebble Backend" cmd /c "cd /d %~dp0backend && py -3.11 -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload"
if %errorlevel% neq 0 (
    echo WARNING: Backend failed to start. Frontend will use mock mode.
) else (
    echo OK: Backend starting on http://localhost:8080
)
timeout /t 3 /nobreak >nul

:: Start frontend
echo.
echo [2/2] Starting frontend (React + Vite)...
start "Pebble Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"
echo OK: Frontend starting on http://localhost:5173

echo.
echo ===========================================
echo  Pebble is ready!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080
echo ===========================================
echo.
echo Close this window to keep both servers running.
pause
