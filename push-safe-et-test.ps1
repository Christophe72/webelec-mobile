param(
    [string]$Message
)

$ErrorActionPreference = "Stop"

function Normalize-Path([string]$path) {
    return (Resolve-Path $path).Path.ToLower()
}

# Chemin du monorepo
$AllowedRepoRoot = "C:\saas\webelec-saas"
$Allowed = Normalize-Path $AllowedRepoRoot

# Petite fonction pour terminer proprement AVEC pause
function Stop-Script([string]$reason, [string]$color = "Red") {
    Write-Host $reason -ForegroundColor $color
    Write-Host ""
    Read-Host "Appuie sur ENTRÉE pour fermer cette fenêtre"
    return
}

try {
    # Récupérer la racine Git courante
    try {
        $RepoRoot = git rev-parse --show-toplevel 2>$null
        $RepoRoot = Normalize-Path $RepoRoot
    } catch {
        Stop-Script "ERREUR : Ce dossier n'est pas un repository Git."
        return
    }

    # Vérifier repo correct
    if ($RepoRoot -ne $Allowed) {
        Write-Host "REFUS : Tu n'es pas dans le bon repository." -ForegroundColor Red
        Write-Host "Actuel   : $RepoRoot"
        Write-Host "Autorisé : $Allowed"
        Stop-Script "Sortie du script."
        return
    }

    # Vérifier la branche
    $Branch = git rev-parse --abbrev-ref HEAD
    $AllowedBranches = @("main", "dev")

    if ($Branch -notin $AllowedBranches -and -not ($Branch -like "feature/*")) {
        Stop-Script "REFUS : La branche '$Branch' n'est pas autorisée."
        return
    }

    # DEMANDE DU MESSAGE SI VIDE
    if (-not $Message) {
        $Message = Read-Host "Message de commit"
        if (-not $Message) {
            Stop-Script "Annulé : aucun message de commit fourni." "Yellow"
            return
        }
    }

    # PROTECTION SUR MAIN
    if ($Branch -eq "main") {
        Write-Host "ATTENTION : tu es sur la branche 'main' !" -ForegroundColor Yellow
        $Confirm = Read-Host "Confirmer le push ? (O/N)"

        if ($Confirm.ToLower() -ne "o") {
            Stop-Script "PUSH ANNULÉ." "Red"
            return
        }
    }

    # ============================
    #   TESTS MAVEN BACKEND
    # ============================

    $BackendPath = Join-Path $RepoRoot "backend"

    if (-not (Test-Path $BackendPath)) {
        Stop-Script "ERREUR : le dossier 'backend' est introuvable à $BackendPath"
        return
    }

    Write-Host "=== Lancement des tests Maven backend (profil test) ===" -ForegroundColor Cyan
    Push-Location $BackendPath

    mvn clean test "-Dspring.profiles.active=test"
    $TestExitCode = $LASTEXITCODE

    Pop-Location

    if ($TestExitCode -ne 0) {
        Stop-Script "❌ TESTS ÉCHOUÉS – PUSH ANNULÉ. Corrige les tests Maven avant de pousser." "Red"
        return
    }

    Write-Host "✅ Tests Maven OK – commit & push autorisés." -ForegroundColor Green

    # ============================
    #   COMMIT & PUSH
    # ============================

    Write-Host "Pushing depuis '$RepoRoot' sur '$Branch'..." -ForegroundColor Green
    git add .
    git commit -m "$Message"

    Write-Host "Synchronisation avec le dépôt distant (git pull --rebase)..." -ForegroundColor Cyan
    git pull --rebase

    Write-Host "Push vers origin/$Branch..." -ForegroundColor Cyan
    git push

    Write-Host ""
    Stop-Script "✅ PUSH TERMINÉ AVEC SUCCÈS." "Green"

} catch {
    Write-Host "ERREUR INATTENDUE :" -ForegroundColor Red
    Write-Host $_
    Write-Host ""
    Read-Host "Appuie sur ENTRÉE pour fermer cette fenêtre"
}
