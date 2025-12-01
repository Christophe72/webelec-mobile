param(
    [string]$Message = "update"
)

# Chemin autorisé (monorepo)
$AllowedRepoRoot = "C:\saas\webelec-saas"

# Fonction pour normaliser les chemins
function Normalize-Path([string]$path) {
    return (Resolve-Path $path).Path.ToLower()
}

# Normaliser le repo autorisé
$Allowed = Normalize-Path $AllowedRepoRoot

# Récupérer la racine du repo courant
try {
    $RepoRoot = git rev-parse --show-toplevel 2>$null
    $RepoRoot = Normalize-Path $RepoRoot
} catch {
    Write-Host "ERREUR : Ce dossier n'est pas un repository Git." -ForegroundColor Red
    exit 1
}

# Vérifier si on est dans le bon repo
if ($RepoRoot -ne $Allowed) {
    Write-Host "REFUS : Tu n'es pas dans le bon repository Git." -ForegroundColor Red
    Write-Host "Dossier courant : $RepoRoot"
    Write-Host "Repo autorisé :  $Allowed"
    exit 1
}

# Vérifier la branche
$Branch = git rev-parse --abbrev-ref HEAD

$AllowedBranches = @("main", "dev")

if ($Branch -notin $AllowedBranches -and -not ($Branch -like "feature/*")) {
    Write-Host "REFUS : Pousser sur '$Branch' est interdit." -ForegroundColor Red
    exit 1
}

# Tout OK → push
Write-Host "OK : Pushing depuis '$RepoRoot' sur la branche '$Branch'..." -ForegroundColor Green

git add .
git commit -m "$Message"
git push
