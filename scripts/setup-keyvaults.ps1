# Setup Azure Key Vault for Secrets Management (Recommended for Production)

param(
    [string]$KeyVaultName = "stempro-keyvault"
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

Write-Host "🔐 Setting up Azure Key Vault..." -ForegroundColor Green

# Create Key Vault
Write-Host "Creating Key Vault..." -ForegroundColor Yellow
az keyvault create `
    --name $KeyVaultName `
    --resource-group $env:RESOURCE_GROUP `
    --location $env:LOCATION

# Store secrets in Key Vault
Write-Host "`nStoring secrets in Key Vault..." -ForegroundColor Yellow

$secrets = @{
    "secret-key" = $env:SECRET_KEY
    "mailgun-api-key" = $env:MAILGUN_API_KEY
    "mailgun-domain" = $env:MAILGUN_DOMAIN
    "registry-password" = $env:REGISTRY_PASSWORD
}

foreach ($key in $secrets.Keys) {
    az keyvault secret set `
        --vault-name $KeyVaultName `
        --name $key `
        --value $secrets[$key] | Out-Null
    Write-Host "✓ Stored: $key" -ForegroundColor Green
}

# Grant Container Apps access to Key Vault
Write-Host "`nConfiguring Key Vault access..." -ForegroundColor Yellow

# Get Container Apps managed identity
$backendIdentity = az containerapp identity show `
    --name $env:BACKEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query principalId -o tsv

$frontendIdentity = az containerapp identity show `
    --name $env:FRONTEND_APP_NAME `
    --resource-group $env:RESOURCE_GROUP `
    --query principalId -o tsv

# Grant access to Key Vault
if ($backendIdentity) {
    az keyvault set-policy `
        --name $KeyVaultName `
        --object-id $backendIdentity `
        --secret-permissions get list
}

if ($frontendIdentity) {
    az keyvault set-policy `
        --name $KeyVaultName `
        --object-id $frontendIdentity `
        --secret-permissions get list
}

Write-Host "`n✅ Key Vault setup complete!" -ForegroundColor Green
Write-Host "Key Vault Name: $KeyVaultName" -ForegroundColor Cyan
Write-Host "`nSecrets are now stored securely in Azure Key Vault" -ForegroundColor Yellow