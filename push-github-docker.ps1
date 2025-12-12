param(
    [string]$Message,
    [switch]$DockerBuild,
    [switch]$DockerCheck
)

# Fonction pour normaliser les chemins
function Convert-ToNormalizedPath([string]$path) {
    return (Resolve-Path $path).Path.ToLower()
}

# Chemin du monorepo
$AllowedRepoRoot = "C:\saas\webelec-saas"
$Allowed = Convert-ToNormalizedPath $AllowedRepoRoot

# Vérifier que Docker est disponible
function Test-DockerRunning {
    try {
        docker info > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

# Vérifier repo Git
try {
    $RepoRoot = git rev-parse --show-toplevel 2>$null
    $RepoRoot = Convert-ToNormalizedPath $RepoRoot
} catch {
    Write-Host "ERREUR : Ce dossier n'est pas un repository Git." -ForegroundColor Red
    exit 1
}

if ($RepoRoot -ne $Allowed) {
    Write-Host "REFUS : Tu n'es pas dans le bon repository." -ForegroundColor Red
    Write-Host "Actuel : $RepoRoot"
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

# Message de commit
if (-not $Message) {
    $Message = Read-Host "Message de commit"
    if (-not $Message) {
        Write-Host "Annulé : aucun message de commit fourni." -ForegroundColor Yellow
        exit 1
    }
}

# Protection main
if ($Branch -eq "main") {
    Write-Host "ATTENTION : tu es sur la branche 'main' !" -ForegroundColor Yellow
    $Confirm = Read-Host "Confirmer le push ? (O/N)"
    if ($Confirm.ToLower() -ne "o") {
        Write-Host "PUSH ANNULÉ." -ForegroundColor Red
        exit 1
    }
}

# Vérification Docker optionnelle
if ($DockerCheck) {
    Write-Host "Vérification Docker..." -ForegroundColor Cyan
    if (-not (Test-DockerRunning)) {
        Write-Host "ERREUR : Docker n'est pas démarré." -ForegroundColor Red
        exit 1
    }

    $RunningContainers = docker ps --format "{{.Names}}"
    Write-Host "Conteneurs actifs :" -ForegroundColor Green
    $RunningContainers | ForEach-Object { Write-Host " - $_" }
}

# Rebuild Docker optionnel
if ($DockerBuild) {
    Write-Host "Rebuild Docker Compose..." -ForegroundColor Cyan

    if (-not (Test-DockerRunning)) {
        Write-Host "ERREUR : Docker n'est pas démarré." -ForegroundColor Red
        exit 1
    }

    docker compose down
    docker compose up -d --build
}

# Commit & push
Write-Host "Pushing depuis '$RepoRoot' sur '$Branch'..." -ForegroundColor Green

git add .
git commit -m "$Message"

git pull --rebase
git push

Write-Host "PUSH TERMINÉ AVEC SUCCÈS." -ForegroundColor Green
