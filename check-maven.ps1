Write-Host "=== Vérification complète Maven & PATH ===" -ForegroundColor Cyan

Write-Host "`n1. Contenu du dossier Maven :" -ForegroundColor Yellow
dir "C:\Maven\apache-maven-3.9.9\bin"

Write-Host "`n2. PATH Système :" -ForegroundColor Yellow
[Environment]::GetEnvironmentVariable("Path","Machine")

Write-Host "`n3. PATH Utilisateur :" -ForegroundColor Yellow
[Environment]::GetEnvironmentVariable("Path","User")

Write-Host "`n4. JAVA_HOME :" -ForegroundColor Yellow
echo $env:JAVA_HOME

Write-Host "`n5. Test 'where mvn' :" -ForegroundColor Yellow
where mvn

Write-Host "`n6. Test 'mvn -v' :" -ForegroundColor Yellow
cmd /c "mvn -v"

