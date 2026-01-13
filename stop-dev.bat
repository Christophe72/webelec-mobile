@echo off
REM Script d'arrêt - WebElec SaaS

echo ========================================
echo   WebElec SaaS - Arret des services
echo ========================================
echo.

echo [INFO] Arret des services Docker (PostgreSQL et PgAdmin)...
docker-compose stop postgres pgadmin

echo.
echo [INFO] Services Docker arretes avec succes!
echo.
echo ========================================
echo   Note :
echo ========================================
echo.
echo Si vous avez demarré le backend ou le frontend
echo localement, appuyez sur Ctrl+C dans leurs
echo terminaux respectifs pour les arreter.
echo.
echo Pour supprimer completement les donnees PostgreSQL:
echo   docker-compose down -v
echo.
echo ========================================
pause
