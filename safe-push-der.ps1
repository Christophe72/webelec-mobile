param(
    [string]$Message
)

$ErrorActionPreference = "Stop"

# -------------------------------------------------
# Fonctions utilitaires
# -------------------------------------------------
function Fail($msg) {
    Write-Host "❌ $msg" -ForegroundColor Red
    exit 1
}

function Ok($msg) {
    Write-Host "✔ $msg" -ForegroundColor Green
}

function Step($msg) {
    Write-Host ""
    Write-Host "▶ $msg" -ForegroundColor Cyan
}

function Convert-ToNormalizedPath([string]$path) {
    return (Resolve-Path $path).Path.ToLower()
}

# -------------------------------------------------
# 1. Vérification du repository
# -------------------------------------------------
Step "Vérification du repository Git"

$AllowedRepoRoot = "C:\saas\webelec-saas"
$Allowed = Convert-ToNormalizedPath $AllowedRepoRoot

try {
    $RepoRoot = git rev-parse --show-toplevel 2>$null
    $RepoRoot = Convert-ToNormalizedPath $RepoRoot
} catch {
    Fail "Ce dossier n'est pas un repository Git."
}

if ($RepoRoot -ne $Allowed) {
    Fail "Mauvais repository. Actuel: $RepoRoot | Autorisé: $Allowed"
}

Ok "Repository valide"

# -------------------------------------------------
# 2. Vérification de la branche
# -------------------------------------------------
Step "Vérification de la branche"

$Branch = git rev-parse --abbrev-ref HEAD
$AllowedBranches = @("main", "dev")

if ($Branch -notin $AllowedBranches -and -not ($Branch -like "feature/*")) {
    Fail "Branche '$Branch' non autorisée"
}

Ok "Branche autorisée : $Branch"

# -------------------------------------------------
# 3. Vérifier état Git propre
# -------------------------------------------------
Step "Vérification état Git"

$Status = git status --porcelain
if (-not $Status) {
    Fail "Aucun changement à commit. Repo déjà propre."
}

Ok "Changements détectés"

# -------------------------------------------------
# 4. Vérification pnpm (frontend)
# -------------------------------------------------
Step "Vérification pnpm"

Push-Location frontend

if (!(Test-Path pnpm-lock.yaml)) {
    Fail "pnpm-lock.yaml absent (npm/yarn suspect)"
}

pnpm -v | Out-Null
Ok "pnpm présent"

# -------------------------------------------------
# 5. Vérifications techniques frontend
# -------------------------------------------------
Step "Frontend – lint / typecheck / build"

pnpm lint
pnpm typecheck
pnpm build

Pop-Location
Ok "Frontend valide"

# -------------------------------------------------
# 6. Message de commit
# -------------------------------------------------
if (-not $Message) {
    $Message = Read-Host "Message de commit"
    if (-not $Message) {
        Fail "Aucun message de commit fourni"
    }
}

# -------------------------------------------------
# 7. Protection branche main
# -------------------------------------------------
if ($Branch -eq "main") {
    Write-Host "⚠️ ATTENTION : branche 'main'" -ForegroundColor Yellow
    $Confirm = Read-Host "Confirmer le push ? (O/N)"
    if ($Confirm.ToLower() -ne "o") {
        Fail "Push annulé"
    }
}

# -------------------------------------------------
# 8. Commit & push
# -------------------------------------------------
try {
    # ===== TON SCRIPT ICI (inchangé) =====

    git add .
    git commit -m "$Message"
    git pull --rebase
    git push

    Write-Host ""
    Write-Host "✔ PUSH TERMINÉ AVEC SUCCÈS" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "❌ ERREUR BLOQUANTE :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
finally {
    Write-Host ""
    Write-Host "Appuie sur une touche pour fermer..." -ForegroundColor Yellow
    Read-Host
}
Ok "Push effectué avec succès"
