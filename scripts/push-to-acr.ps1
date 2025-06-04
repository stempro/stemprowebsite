# Push Docker Images to Azure Container Registry
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

Write-Host "📤 Pushing Images to Azure Container Registry..." -ForegroundColor Green

# Login to ACR
Write-Host "Logging into ACR..." -ForegroundColor Yellow
$loginResult = docker login $env:REGISTRY_SERVER -u $env:REGISTRY_USERNAME -p $env:REGISTRY_PASSWORD 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ACR login failed!" -ForegroundColor Red
    Write-Host $loginResult
    exit 1
}

# Tag and push backend
Write-Host "`nPushing Backend Image..." -ForegroundColor Cyan
$backendImage = "$($env:REGISTRY_SERVER)/$($env:BACKEND_IMAGE_NAME):$Version"
docker tag "$($env:BACKEND_IMAGE_NAME):latest" $backendImage
docker push $backendImage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend push failed!" -ForegroundColor Red
    exit 1
}

# Tag and push frontend
Write-Host "`nPushing Frontend Image..." -ForegroundColor Cyan
$frontendImage = "$($env:REGISTRY_SERVER)/$($env:FRONTEND_IMAGE_NAME):$Version"
docker tag "$($env:FRONTEND_IMAGE_NAME):latest" $frontendImage
docker push $frontendImage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend push failed!" -ForegroundColor Red
    exit 1
}

# Also push latest tags
if ($Version -ne "latest") {
    Write-Host "`nPushing 'latest' tags..." -ForegroundColor Yellow

    docker tag $backendImage "$($env:REGISTRY_SERVER)/$($env:BACKEND_IMAGE_NAME):latest"
    docker push "$($env:REGISTRY_SERVER)/$($env:BACKEND_IMAGE_NAME):latest"

    docker tag $frontendImage "$($env:REGISTRY_SERVER)/$($env:FRONTEND_IMAGE_NAME):latest"
    docker push "$($env:REGISTRY_SERVER)/$($env:FRONTEND_IMAGE_NAME):latest"
}

Write-Host "`n✅ Images pushed successfully!" -ForegroundColor Green
Write-Host "Backend: $backendImage" -ForegroundColor Cyan
Write-Host "Frontend: $frontendImage" -ForegroundColor Cyan