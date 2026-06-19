@echo off
echo =======================================================
echo    Starting Mie Ayam Chili Oil - Localhost Servers
echo =======================================================
echo.
echo Starting Backend (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm.cmd run dev"

echo Starting Frontend (Vite - Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo Menunggu server siap... (Waiting for servers to be ready...)
timeout /t 5 /nobreak > nul

echo.
echo Membuka Marketplace dan Admin Panel di browser...
start http://localhost:5173
start http://localhost:5173/admin

echo.
echo Both servers have been started and opened in your browser!
echo - Backend API will run on http://localhost:5000
echo - Frontend Website (Marketplace) will run on http://localhost:5173
echo - Frontend Admin Panel will run on http://localhost:5173/admin
echo.
pause
