# Setup Azure Resources (One-time setup)

# Load environment variables
$envFile = ".env.azure"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

Write-Host "🔧 Setting up Azure Resources..." -ForegroundColor Green

# Step 1: Create Resource Group
Write-Host "`n1️⃣ Creating Resource Group..." -ForegroundColor Yellow
az group create `
    --name $env:RESOURCE_GROUP `
    --location $env:LOCATION

# Step 2: Create Container Registry
Write-Host "`n2️⃣ Creating Container Registry..." -ForegroundColor Yellow
az acr create `
    --resource-group $env:RESOURCE_GROUP `
    --name $env:REGISTRY_USERNAME `
    --sku Basic `
    --location $env:LOCATION

# Enable admin access
az acr update -n $env:REGISTRY_USERNAME --admin-enabled true

# Get and update registry credentials
$creds = az acr credential show -n $env:REGISTRY_USERNAME | ConvertFrom-Json
Write-Host "Registry Password: $($creds.passwords[0].value)" -ForegroundColor Yellow
Write-Host "⚠️  Update this password in .env.azure file!" -ForegroundColor Red

# Step 3: Create Storage Account
Write-Host "`n3️⃣ Creating Storage Account..." -ForegroundColor Yellow
az storage account create `
    --name $env:AZURE_STORAGE_ACCOUNT `
    --resource-group $env:RESOURCE_GROUP `
    --location $env:LOCATION `
    --sku Standard_LRS

# Get storage key
$storageKey = az storage account keys list `
    --resource-group $env:RESOURCE_GROUP `
    --account-name $env:AZURE_STORAGE_ACCOUNT `
    --query '[0].value' -o tsv

# Create file share
az storage share create `
    --name $env:AZURE_FILE_SHARE_NAME `
    --account-name $env:AZURE_STORAGE_ACCOUNT `
    --account-key $storageKey

# Step 4: Create Container Apps Environment
Write-Host "`n4️⃣ Creating Container Apps Environment..." -ForegroundColor Yellow
az containerapp env create `
    --name $env:ENVIRONMENT_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --location $env:LOCATION

# Add storage to environment
az containerapp env storage set `
    --name $env:ENVIRONMENT_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --storage-name stempro-storage `
    --azure-file-account-name $env:AZURE_STORAGE_ACCOUNT `
    --azure-file-account-key $storageKey `
    --azure-file-share-name $env:AZURE_FILE_SHARE_NAME `
    --access-mode ReadWrite

# Step 5: Create Initial Container Apps
Write-Host "`n5️⃣ Creating Container Apps..." -ForegroundColor Yellow

# Create Backend
az containerapp create `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --environment $env:ENVIRONMENT_NAME `
    --image "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" `
    --target-port 8000 `
    --ingress 'external' `
    --cpu 0.5 `
    --memory 1 `
    --min-replicas 1 `
    --max-replicas 3

# Create Frontend
az containerapp create `
    --name $env:FRONTEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --environment $env:ENVIRONMENT_NAME `
    --image "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" `
    --target-port 3000 `
    --ingress 'external' `
    --cpu 0.5 `
    --memory 1 `
    --min-replicas 1 `
    --max-replicas 3

Write-Host "`n✅ Azure resources created successfully!" -ForegroundColor Green
Write-Host "`n⚠️  Important: Update the REGISTRY_PASSWORD in .env.azure with the value shown above!" -ForegroundColor Red
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.azure with your actual values"
Write-Host "2. Run '🚀 Deploy to Azure (Full)' task to deploy your application"