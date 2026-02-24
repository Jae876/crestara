@echo off
REM Crestara Project Setup Script for Windows

echo.
echo ============================================
echo   Crestara Platform - Docker Setup
echo ============================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo After installation, restart PowerShell/CMD and run this script again.
    pause
    exit /b 1
)

echo ✓ Docker found!
docker --version

REM Check if Docker daemon is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker daemon is not running!
    echo.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✓ Docker daemon is running!
echo.

REM Start Docker Compose services
echo Starting PostgreSQL and Redis...
echo.

docker-compose up -d

timeout /t 3 /nobreak

REM Check if services are up
docker-compose ps

echo.
echo ✓ Docker services started!
echo.
echo Services running:
echo   - PostgreSQL:   localhost:5432
echo   - Redis:        localhost:6379
echo   - PgAdmin:      http://localhost:5050
echo.
echo Database credentials:
echo   User:     crestara
echo   Password: postgres
echo   Database: crestara_dev
echo.

pause
echo.
echo Next steps (in separate terminals):
echo.
echo 1. Setup Database:
echo    cd backend
echo    npm run db:generate
echo    npm run db:migrate
echo.
echo 2. Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Visit: http://localhost:3000
echo.
pause
