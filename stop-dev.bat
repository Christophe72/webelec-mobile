@echo off
REM Script d'arrêt - WebElec SaaS

echo ========================================
echo   WebElec SaaS - Arrêt des services
echo ========================================
echo.

echo [INFO] Arrêt des services Docker (PostgreSQL et PgAdmin)...
docker-compose stop postgres pgadmin

echo.
echo [INFO] Services Docker arrêtés avec succès!
echo.
echo ========================================
echo   Note :
echo ========================================
echo.
echo Si vous avez démarré le backend ou le frontend
echo localement, appuyez sur Ctrl+C dans leurs
echo terminaux respectifs pour les arrêter.
echo.
echo Pour supprimer completement les donnees PostgreSQL:
echo   docker-compose down -v
echo.
echo ========================================
pause
