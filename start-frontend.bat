@echo off
echo ========================================
echo   SEUAirline Frontend Startup Script
echo   Mode: Connect to Real Backend API
echo ========================================
echo.

echo [1/2] Checking environment config...
if exist .env.development (
    findstr "VITE_USE_MOCK=false" .env.development >nul
    if %errorlevel% equ 0 (
        echo   [OK] Mock is disabled, will connect to backend
    ) else (
        echo   [WARN] Mock is still enabled
        echo   Suggest: Set VITE_USE_MOCK=false in .env.development
    )
) else (
    echo   [WARN] .env.development file not found
)

echo.
echo [2/2] Starting frontend dev server...
echo ========================================
echo.

npm run dev
