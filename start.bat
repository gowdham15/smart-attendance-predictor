@echo off
echo ===================================================
echo   Smart Attendance Predictor - KGiSL / Litz Tech
echo   Student: Gowdham S (711724UAD133)
echo ===================================================
echo.

IF NOT EXIST "node_modules\" (
    echo [1/2] Installing dependencies (First time setup)...
    call npm install
) ELSE (
    echo [1/2] Dependencies already installed!
)

echo.
echo [2/2] Starting Development Server...
echo Opening in browser at http://localhost:3000 ...
start http://localhost:3000
call npm run dev

pause
