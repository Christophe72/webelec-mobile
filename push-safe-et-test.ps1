param(
    [string]$Message
)

# Fonction pour normaliser les chemins
function Normalize-Path([string]$path) {
    return (Resolve-Path $path).Path.ToLower()
}

# Chemin du monorepo
$AllowedRepoRoot = "C:\saas\webelec-saas"
$Allowed = Normalize-Path $AllowedRepoRoot

# Récupérer la racine Git courante
try {
    $RepoRoot = git rev-parse --show-toplevel 2>$null
    $RepoRoot = Normalize-Path $RepoRoot
} catch {
    Write-Host "ERREUR : Ce dossier n'est pas un repository Git." -ForegroundColor Red
    exit 1
}

# Vérifier repo correct
if ($RepoRoot -ne $Allowed) {
    Write-Host "REFUS : Tu n'es pas dans le bon repository." -ForegroundColor Red
    Write-Host "Actuel   : $RepoRoot"
    Write-Host "Autorisé : $Allowed"
    exit 1
}

# Vérifier la branche
$Branch = git rev-parse --abbrev-ref HEAD
$AllowedBranches = @("main", "dev")

if ($Branch -notin $AllowedBranches -and -not ($Branch -like "feature/*")) {
    Write-Host "REFUS : La branche '$Branch' n'est pas autorisée." -ForegroundColor Red
    exit 1
}

# DEMANDE DU MESSAGE SI VIDE
if (-not $Message) {
    $Message = Read-Host "Message de commit"
    if (-not $Message) {
        Write-Host "Annulé : aucun message de commit fourni." -ForegroundColor Yellow
        exit 1
    }
}

# PROTECTION SUR MAIN
if ($Branch -eq "main") {
    Write-Host "ATTENTION : tu es sur la branche 'main' !" -ForegroundColor Yellow
    $Confirm = Read-Host "Confirmer le push ? (O/N)"

    if ($Confirm.ToLower() -ne "o") {
        Write-Host "PUSH ANNULÉ." -ForegroundColor Red
        exit 1
    }
}

# =====================================================================
#  ÉTAPE TESTS MAVEN BACKEND – REFUS DU PUSH SI LES TESTS ÉCHOUENT
# =====================================================================

# On se place dans le dossier backend pour lancer les tests
$BackendPath = Join-Path $RepoRoot "backend"

if (-not (Test-Path $BackendPath)) {
    Write-Host "ERREUR : le dossier 'backend' est introuvable à $BackendPath" -ForegroundColor Red
    exit 1
}

Write-Host "=== Lancement des tests Maven backend (profil test) ===" -ForegroundColor Cyan
Push-Location $BackendPath

# Important : guillemets autour du -D pour PowerShell
mvn clean test "-Dspring.profiles.active=test"
$TestExitCode = $LASTEXITCODE

Pop-Location

if ($TestExitCode -ne 0) {
    Write-Host "❌ TESTS ÉCHOUÉS – PUSH ANNULÉ" -ForegroundColor Red
    Write-Host "Corrige les tests Maven du backend avant de pousser." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tests Maven OK – on peut committer et pousser." -ForegroundColor Green

# =====================================================================
#  COMMIT & PUSH
# =====================================================================

Write-Host "Pushing depuis '$RepoRoot' sur '$Branch'..." -ForegroundColor Green

git add .
git commit -m "$Message"

# Synchronisation avec le dépôt distant avant push
git pull --rebase

git push
