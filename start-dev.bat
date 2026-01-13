@echo off
REM Script de démarrage rapide - WebElec SaaS
REM Option 2 : Backend et Frontend locaux + PostgreSQL Docker

echo ========================================
echo   WebElec SaaS - Demarrage rapide
echo ========================================
echo.

REM Démarrer PostgreSQL et PgAdmin dans Docker
echo [1/3] Demarrage PostgreSQL et PgAdmin...
docker-compose up -d postgres pgadmin

REM Vérifier le statut
echo.
echo [2/3] Verification des services Docker...
timeout /t 5 /nobreak > nul
docker-compose ps

echo.
echo [3/3] Services Docker demarres avec succes!
echo.
echo ========================================
echo   Instructions suivantes :
echo ========================================
echo.
echo Backend (dans un nouveau terminal):
echo   cd backend
echo   mvnw spring-boot:run
echo.
echo Frontend (dans un autre terminal):
echo   cd frontend
echo   pnpm dev
echo.
echo Acces:
echo   - Frontend:  http://localhost:3000
echo   - Backend:   http://localhost:8080
echo   - PgAdmin:   http://localhost:5050
echo.
echo ========================================
pause
