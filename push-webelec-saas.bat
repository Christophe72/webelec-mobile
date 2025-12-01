@echo off
REM Script pour pousser le projet webelec-saas sur GitHub

REM 1) Aller dans le dossier du projet
cd /d C:\saas\webelec-saas

REM 2) Afficher l'état actuel
echo === git status avant ===
git status

REM 3) Ajouter tous les fichiers modifiés
git add .

REM 4) Définir le message de commit
REM    - Si tu passes un paramètre, on l'utilise comme message
REM    - Sinon, on met un message par défaut
if "%~1"=="" (
    set COMMIT_MSG=MAJ automatique webelec-saas
) else (
    set COMMIT_MSG=%*
)

echo.
echo === Commit avec le message: "%COMMIT_MSG%" ===
git commit -m "%COMMIT_MSG%" --allow-empty-message
REM 5) Pousser sur la branche main
echo.
echo === Push vers origin/main ===
git push origin main

echo.
echo === Terminé ===
pause