# ================================
# INSTALLATION AUTOMATIQUE MAVEN
# ================================

Write-Host "=== Installation automatique Apache Maven ===" -ForegroundColor Cyan

# ------------------------------
# 1. Vérification JAVA
# ------------------------------
Write-Host "Vérification de JAVA_HOME..."

if (-not (Test-Path $env:JAVA_HOME)) {
    Write-Host "JAVA_HOME n'existe pas. Tentative de détection automatique..." -ForegroundColor Yellow
    
    # Recherche d’un JDK dans Program Files
    $jdk = Get-ChildItem "C:\Program Files" -Directory | Where-Object { $_.Name -match "Java" } | Select-Object -First 1

    if ($jdk) {
        $jdkPath = "C:\Program Files\$($jdk.Name)"
        Write-Host "JDK détecté : $jdkPath"
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $jdkPath, "Machine")
    } else {
        Write-Host "Aucun Java détecté. Installe d'abord un JDK (OpenJDK 21 recommandé)." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "JAVA_HOME déjà configuré : $env:JAVA_HOME"
}

# ------------------------------
# 2. Téléchargement Maven
# ------------------------------
$mavenVersion = "3.9.9"
$mavenUrl = "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$installPath = "C:\Program Files\Maven"
$mavenZip = "$installPath\maven.zip"

Write-Host "Téléchargement Maven $mavenVersion..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $installPath | Out-Null
Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip

# ------------------------------
# 3. Extraction Maven
# ------------------------------
Write-Host "Extraction de Maven..."
Expand-Archive -Path $mavenZip -DestinationPath $installPath -Force

# Récupération du dossier exact
$mavenFolder = Get-ChildItem $installPath | Where-Object { $_.Name -match "apache-maven" } | Select-Object -First 1
$mavenBin = "$installPath\$($mavenFolder.Name)\bin"

# ------------------------------
# 4. Configuration variables système
# ------------------------------
Write-Host "Configuration des variables d'environnement..." -ForegroundColor Cyan

# MAVEN_HOME
[Environment]::SetEnvironmentVariable("MAVEN_HOME", "$installPath\$($mavenFolder.Name)", "Machine")

# PATH
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($systemPath -notlike "*$mavenBin*") {
    Write-Host "Ajout de Maven dans le PATH système"
    $newPath = "$systemPath;$mavenBin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
} else {
    Write-Host "Maven déjà présent dans PATH"
}

# Nettoyage
Remove-Item $mavenZip -Force

# ------------------------------
# 5. Vérification finale
# ------------------------------
Write-Host "`n=== Vérification de l’installation ===" -ForegroundColor Green
Write-Host "Ouvre un nouveau terminal et exécute :" -ForegroundColor Yellow
Write-Host "   mvn -v" -ForegroundColor Cyan

Write-Host "`nInstallation terminée." -ForegroundColor Green
# ================================
# INSTALLATION AUTOMATIQUE MAVEN
# ================================

Write-Host "=== Installation automatique Apache Maven ===" -ForegroundColor Cyan

# ------------------------------
# 1. Vérification JAVA
# ------------------------------
Write-Host "Vérification de JAVA_HOME..."

if (-not (Test-Path $env:JAVA_HOME)) {
    Write-Host "JAVA_HOME n'existe pas. Tentative de détection automatique..." -ForegroundColor Yellow
    
    # Recherche d’un JDK dans Program Files
    $jdk = Get-ChildItem "C:\Program Files" -Directory | Where-Object { $_.Name -match "Java" } | Select-Object -First 1

    if ($jdk) {
        $jdkPath = "C:\Program Files\$($jdk.Name)"
        Write-Host "JDK détecté : $jdkPath"
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $jdkPath, "Machine")
    } else {
        Write-Host "Aucun Java détecté. Installe d'abord un JDK (OpenJDK 21 recommandé)." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "JAVA_HOME déjà configuré : $env:JAVA_HOME"
}

# ------------------------------
# 2. Téléchargement Maven
# ------------------------------
$mavenVersion = "3.9.9"
$mavenUrl = "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$installPath = "C:\Program Files\Maven"
$mavenZip = "$installPath\maven.zip"

Write-Host "Téléchargement Maven $mavenVersion..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $installPath | Out-Null
Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip

# ------------------------------
# 3. Extraction Maven
# ------------------------------
Write-Host "Extraction de Maven..."
Expand-Archive -Path $mavenZip -DestinationPath $installPath -Force

# Récupération du dossier exact
$mavenFolder = Get-ChildItem $installPath | Where-Object { $_.Name -match "apache-maven" } | Select-Object -First 1
$mavenBin = "$installPath\$($mavenFolder.Name)\bin"

# ------------------------------
# 4. Configuration variables système
# ------------------------------
Write-Host "Configuration des variables d'environnement..." -ForegroundColor Cyan

# MAVEN_HOME
[Environment]::SetEnvironmentVariable("MAVEN_HOME", "$installPath\$($mavenFolder.Name)", "Machine")

# PATH
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($systemPath -notlike "*$mavenBin*") {
    Write-Host "Ajout de Maven dans le PATH système"
    $newPath = "$systemPath;$mavenBin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
} else {
    Write-Host "Maven déjà présent dans PATH"
}

# Nettoyage
Remove-Item $mavenZip -Force

# ------------------------------
# 5. Vérification finale
# ------------------------------
Write-Host "`n=== Vérification de l’installation ===" -ForegroundColor Green
Write-Host "Ouvre un nouveau terminal et exécute :" -ForegroundColor Yellow
Write-Host "   mvn -v" -ForegroundColor Cyan

Write-Host "`nInstallation terminée." -ForegroundColor Green
