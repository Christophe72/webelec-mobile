# test-api.ps1
# Script PowerShell pour tester ton backend Spring et ton proxy Next.js

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )

    Write-Host ""
    Write-Host "=== $Method $Url ===" -ForegroundColor Cyan

    try {
        if ($Body) {
            $Response = Invoke-RestMethod -Method $Method -Uri $Url -Body $Body -ContentType "application/json"
        } else {
            $Response = Invoke-RestMethod -Method $Method -Uri $Url
        }

        Write-Host "OK – Status 200/201 probable" -ForegroundColor Green
        Write-Host ($Response | ConvertTo-Json -Depth 10)
    }
    catch {
        Write-Host "Erreur :" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

Write-Host ""
Write-Host "#############################################" -ForegroundColor Yellow
Write-Host "#   TEST BACKEND SPRING (port 8080)          #"
Write-Host "#############################################" -ForegroundColor Yellow

Invoke-Api -Method "GET" -Url "http://localhost:8080/api/societes"

Invoke-Api -Method "POST" -Url "http://localhost:8080/api/societes" -Body '{
  "nom": "WebElec",
  "tva": "BE0123456789",
  "email": "contact@webelec.be",
  "telephone": "0470/00.00.00",
  "adresse": "Rue des Artisans 12, Liège"
}'

# Exemple si tu veux tester le DELETE plus tard
# Invoke-Api -Method "DELETE" -Url "http://localhost:8080/api/societes/1"


Write-Host ""
Write-Host "#############################################" -ForegroundColor Magenta
Write-Host "#   TEST PROXY NEXT.JS (port 3000)           #"
Write-Host "#############################################" -ForegroundColor Magenta

Invoke-Api -Method "GET" -Url "http://localhost:3000/api/test/chantiers"

Invoke-Api -Method "POST" -Url "http://localhost:3000/api/test/chantiers" -Body '{
  "nom": "Installation nouvelle cuisine",
  "adresse": "Rue du Four 15, 4000 Liège",
  "description": "Tableau secondaire + circuit prises + éclairage LED",
  "societeId": 1
}'

Invoke-Api -Method "GET" -Url "http://localhost:3000/api/test/produits"

Invoke-Api -Method "POST" -Url "http://localhost:3000/api/test/produits" -Body '{
  "reference": "REF-001",
  "nom": "Disjoncteur 16A",
  "description": "Courbe C",
  "quantiteStock": 25,
  "prixUnitaire": 14.9,
  "societeId": 1
}'

Write-Host ""
Write-Host "---------------------------------------------" -ForegroundColor DarkGray
Write-Host "Tests terminés." -ForegroundColor Green
Write-Host "Appuyez sur Enter pour quitter…" -ForegroundColor White
Read-Host
