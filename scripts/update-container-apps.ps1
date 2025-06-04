# Update Azure Container Apps with new images
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

Write-Host "🔄 Updating Azure Container Apps..." -ForegroundColor Green

# Update Backend
Write-Host "`nUpdating Backend Container App..." -ForegroundColor Yellow
$backendImage = "$($env:REGISTRY_SERVER)/$($env:BACKEND_IMAGE_NAME):$Version"

az containerapp update `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --image $backendImage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend update failed!" -ForegroundColor Red
    exit 1
}

# Update Frontend
Write-Host "`nUpdating Frontend Container App..." -ForegroundColor Yellow
$frontendImage = "$($env:REGISTRY_SERVER)/$($env:FRONTEND_IMAGE_NAME):$Version"

# Get backend URL for API endpoint
$backendUrl = az containerapp show `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn -o tsv

az containerapp update `
    --name $env:FRONTEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --image $frontendImage `
    --set-env-vars NEXT_PUBLIC_API_URL="https://$backendUrl"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend update failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Container Apps updated successfully!" -ForegroundColor Green
Write-Host "Version deployed: $Version" -ForegroundColor Cyan

# Show revision information
Write-Host "`nActive Revisions:" -ForegroundColor Yellow

Write-Host "`nBackend:" -ForegroundColor Cyan
az containerapp revision list `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query "[?properties.active].{Name:name, Created:properties.createdTime, Traffic:properties.trafficWeight}" `
    -o table

Write-Host "`nFrontend:" -ForegroundColor Cyan
az containerapp revision list `
    --name $env:FRONTEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query "[?properties.active].{Name:name, Created:properties.createdTime, Traffic:properties.trafficWeight}" `
    -o table