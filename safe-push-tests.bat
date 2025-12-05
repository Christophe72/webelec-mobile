@echo off
REM ============================================================
REM  Script Git + vérification Maven pour WebElec SaaS
REM  Annule le push si les tests du backend échouent
REM ============================================================

REM 1) Chemin principal du projet
set PROJECT=C:\saas\webelec-saas
set BACKEND=%PROJECT%\backend

echo ============================================================
echo   WEBELEC SaaS - PUSH SECURISE AVEC TESTS MAVEN
echo ============================================================

REM 2) Aller dans le backend
cd /d "%BACKEND%"

if not exist "pom.xml" (
    echo ERREUR : Aucun pom.xml trouvé dans %BACKEND%
    pause
    exit /b
)

echo.
echo === Lancement des tests Maven (mvn clean test) ===
mvn clean test

REM 3) Vérification du code retour Maven
if errorlevel 1 (
    echo.
    echo ###############################################################
    echo     ECHEC DES TESTS MAVEN - PUSH ANNULE
    echo ###############################################################
    pause
    exit /b
)

echo.
echo === Tests OK ! ===
echo.

REM 4) Revenir au dossier racine du projet pour le commit/push
cd /d "%PROJECT%"

REM 5) Vérifier repo Git
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERREUR : pas un dépôt Git. Abandon.
    pause
    exit /b
)

REM 6) git add
echo === Ajout des fichiers ===
git add .

REM 7) Préparer le message de commit
if "%~1"=="" (
    set "COMMIT_MSG=MAJ automatique WebElec SaaS (tests OK)"
) else (
    set "COMMIT_MSG=%*"
)

REM 8) Commit
echo.
echo === Commit : "%COMMIT_MSG%" ===
git commit -m "%COMMIT_MSG%"

REM 9) Push
echo.
echo === Push vers origin/main ===
git push origin main

echo.
echo === PUSH REUSSI ===
pause
