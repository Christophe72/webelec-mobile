Write-Host "=== Nettoyage structure WebElec ===" -ForegroundColor Cyan

$root = "C:\saas\webelec-saas"
$oldBackend = "$root\webelec\backend"
$newBackend = "$root\backend"

# Vérifier existence backend réel
if (Test-Path "$oldBackend\pom.xml") {
    Write-Host "Backend réel détecté : $oldBackend" -ForegroundColor Green

    # Déplacer
    if (-Not (Test-Path $newBackend)) {
        Write-Host "Déplacement du backend vers $newBackend..."
        Move-Item $oldBackend $newBackend
    } else {
        Write-Host "ERREUR : $newBackend existe déjà." -ForegroundColor Red
        exit
    }

    # Supprimer ancien dossier parent
    Write-Host "Suppression du dossier webelec inutilisé..."
    Remove-Item "$root\webelec" -Recurse -Force

} else {
    Write-Host "Aucun backend valide trouvé dans $oldBackend" -ForegroundColor Red
}

# Nettoyage fichiers parasites Eclipse / IntelliJ
Write-Host "Nettoyage fichiers IDE..."
Get-ChildItem -Path $root -Recurse -Include "*.iml", ".classpath", ".project" | Remove-Item -Force

Write-Host "Structure finale :" -ForegroundColor Yellow
Get-ChildItem $root

Write-Host "=== Nettoyage terminé ===" -ForegroundColor Green
