# Full Azure Deployment Script
param(
    [string]$Version = "latest"
)

# Load environment variables
$envFile = ".env.azure"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

Write-Host "🚀 Starting Full Azure Deployment..." -ForegroundColor Green
Write-Host "Version: $Version" -ForegroundColor Cyan

# Step 1: Login to Azure
Write-Host "`n1️⃣ Checking Azure Login..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in. Logging into Azure..." -ForegroundColor Yellow
    az login
}
else {
    Write-Host "Already logged in as: $($account.user.name)" -ForegroundColor Green
}

# Step 2: Build Docker Images
Write-Host "`n2️⃣ Building Docker Images..." -ForegroundColor Yellow
$env:VERSION = $Version
docker-compose -f docker-compose.azure.yml --env-file .env.azure build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Push to ACR
Write-Host "`n3️⃣ Pushing Images to ACR..." -ForegroundColor Yellow
& "$PSScriptRoot\push-to-acr.ps1" -Version $Version

# Step 4: Deploy/Update Container Apps
Write-Host "`n4️⃣ Deploying to Azure Container Apps..." -ForegroundColor Yellow
& "$PSScriptRoot\update-container-apps.ps1" -Version $Version

# Step 5: Get URLs and display summary
Write-Host "`n5️⃣ Deployment Summary" -ForegroundColor Green
$backendUrl = az containerapp show `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn -o tsv

$frontendUrl = az containerapp show `
    --name $env:FRONTEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn -o tsv

Write-Host "`n✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Backend URL: https://$backendUrl" -ForegroundColor Cyan
Write-Host "Frontend URL: https://$frontendUrl" -ForegroundColor Cyan
Write-Host "`nVersion Deployed: $Version" -ForegroundColor Yellow

# Open URLs in browser
$openBrowser = Read-Host "`nOpen URLs in browser? (Y/n)"
if ($openBrowser -ne 'n') {
    Start-Process "https://$frontendUrl"
    Start-Process "https://$backendUrl/docs"
}

Write-Host "`nUse VS Code tasks to:" -ForegroundColor Magenta
Write-Host "- View logs: Tasks > Run Task > 📊 View Azure Logs"
Write-Host "- Update app: Tasks > Run Task > 🔄 Update Container Apps"