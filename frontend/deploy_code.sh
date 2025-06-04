#!/bin/bash

# Configuration Variables
RESOURCE_GROUP="your-resource-group-name"
LOCATION="westus3"
ENVIRONMENT_NAME="stempro-env"
REGISTRY_NAME="stemproregistry"  # Must be globally unique
STORAGE_ACCOUNT_NAME="stemprostorage"  # Must be globally unique
FILE_SHARE_NAME="stempro-data"

# Backend Configuration
BACKEND_IMAGE_NAME="stempro-backend"
BACKEND_APP_NAME="stempro-backend"

# Frontend Configuration
FRONTEND_IMAGE_NAME="stempro-frontend"
FRONTEND_APP_NAME="stempro-frontend"

# Your domain
CUSTOM_DOMAIN="your-domain.com"

echo "🚀 Starting Azure Container Apps Deployment..."

# Step 1: Login to Azure
echo "1️⃣ Logging into Azure..."
az login

# Step 2: Create Container Registry
echo "2️⃣ Creating Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $REGISTRY_NAME \
  --sku Basic \
  --location $LOCATION

# Enable admin access
az acr update -n $REGISTRY_NAME --admin-enabled true

# Get registry credentials
REGISTRY_USERNAME=$(az acr credential show -n $REGISTRY_NAME --query username -o tsv)
REGISTRY_PASSWORD=$(az acr credential show -n $REGISTRY_NAME --query passwords[0].value -o tsv)
REGISTRY_SERVER="${REGISTRY_NAME}.azurecr.io"

# Step 3: Build and Push Docker Images
echo "3️⃣ Building and pushing Docker images..."

# Login to ACR
docker login $REGISTRY_SERVER -u $REGISTRY_USERNAME -p $REGISTRY_PASSWORD

# Build and push backend
echo "Building backend..."
cd backend
docker build -t $REGISTRY_SERVER/$BACKEND_IMAGE_NAME:latest .
docker push $REGISTRY_SERVER/$BACKEND_IMAGE_NAME:latest
cd ..

# Build and push frontend
echo "Building frontend..."
cd frontend
docker build -f Dockerfile.production -t $REGISTRY_SERVER/$FRONTEND_IMAGE_NAME:latest .
docker push $REGISTRY_SERVER/$FRONTEND_IMAGE_NAME:latest
cd ..

# Step 4: Create Storage Account and File Share
echo "4️⃣ Creating Storage Account and File Share..."
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT_NAME \
  --query '[0].value' -o tsv)

# Create file share
az storage share create \
  --name $FILE_SHARE_NAME \
  --account-name $STORAGE_ACCOUNT_NAME \
  --account-key $STORAGE_KEY

# Step 5: Create Container Apps Environment
echo "5️⃣ Creating Container Apps Environment..."
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Create storage for Container Apps Environment
az containerapp env storage set \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --storage-name stempro-storage \
  --azure-file-account-name $STORAGE_ACCOUNT_NAME \
  --azure-file-account-key $STORAGE_KEY \
  --azure-file-share-name $FILE_SHARE_NAME \
  --access-mode ReadWrite

# Step 6: Deploy Backend Container App
echo "6️⃣ Deploying Backend Container App..."
az containerapp create \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $REGISTRY_SERVER/$BACKEND_IMAGE_NAME:latest \
  --target-port 8000 \
  --ingress 'external' \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD \
  --cpu 0.5 \
  --memory 1 \
  --min-replicas 1 \
  --max-replicas 3 \
  --secrets \
    secret-key="your-secure-secret-key" \
    mailgun-api-key="your-mailgun-api-key" \
    mailgun-domain="your-mailgun-domain" \
  --env-vars \
    SECRET_KEY=secretref:secret-key \
    MAILGUN_API_KEY=secretref:mailgun-api-key \
    MAILGUN_DOMAIN=secretref:mailgun-domain \
    ENVIRONMENT=production \
    CORS_ORIGINS="https://${CUSTOM_DOMAIN}" \
    FRONTEND_URL="https://${CUSTOM_DOMAIN}" \
    DATA_DIR=/app/data

# Mount the file share
az containerapp update \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars DATA_DIR=/mnt/data \
  --mount-azure-file-volume storage-name=stempro-storage,mount-path=/mnt/data

# Get Backend URL
BACKEND_URL=$(az containerapp show \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Backend URL: https://$BACKEND_URL"

# Step 7: Deploy Frontend Container App
echo "7️⃣ Deploying Frontend Container App..."
az containerapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $REGISTRY_SERVER/$FRONTEND_IMAGE_NAME:latest \
  --target-port 3000 \
  --ingress 'external' \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD \
  --cpu 0.5 \
  --memory 1 \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    NEXT_PUBLIC_API_URL="https://${BACKEND_URL}" \
    NODE_ENV=production

# Get Frontend URL
FRONTEND_URL=$(az containerapp show \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"

# Step 8: Configure Custom Domain (Optional)
echo "8️⃣ Custom domain configuration..."
echo "To configure custom domain:"
echo "1. Add CNAME record: ${CUSTOM_DOMAIN} -> ${FRONTEND_URL}"
echo "2. Run: az containerapp hostname add --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --hostname ${CUSTOM_DOMAIN}"

echo "✅ Deployment Complete!"
echo "Backend: https://$BACKEND_URL"
echo "Frontend: https://$FRONTEND_URL"
echo "Next steps:"
echo "1. Configure your DNS records"
echo "2. Update CORS settings if needed"
echo "3. Test your application"