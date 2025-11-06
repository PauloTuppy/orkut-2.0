# GCP Cloud Run Deployment Script for Orkut 2.0
# PowerShell version for Windows

$ErrorActionPreference = "Continue"
$PROJECT_ID = "orkut-2"
$REGION = "us-central1"

Write-Host "🚀 Deploy Orkut 2.0 to GCP Cloud Run" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host ""

# Check if Cloud SQL exists
Write-Host "📊 Checking existing resources..." -ForegroundColor Yellow
$sqlExists = gcloud sql instances list --filter="name=orkut-db" --format="value(name)" 2>$null

if ($sqlExists) {
    Write-Host "✅ Cloud SQL 'orkut-db' already exists" -ForegroundColor Green
    $CLOUDSQL_CONNECTION = gcloud sql instances describe orkut-db --format='value(connectionName)'
} else {
    Write-Host "🗄️ Creating Cloud SQL (this takes 5-10 minutes)..." -ForegroundColor Yellow
    $DB_PASSWORD = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "DB Password: $DB_PASSWORD" -ForegroundColor Cyan
    
    gcloud sql instances create orkut-db `
        --database-version=POSTGRES_15 `
        --tier=db-f1-micro `
        --region=$REGION `
        --root-password=$DB_PASSWORD `
        --backup `
        --backup-start-time=03:00
    
    Write-Host "Creating database and user..." -ForegroundColor Yellow
    gcloud sql databases create orkut --instance=orkut-db
    gcloud sql users create orkut_user --instance=orkut-db --password=$DB_PASSWORD
    
    $CLOUDSQL_CONNECTION = gcloud sql instances describe orkut-db --format='value(connectionName)'
    Write-Host "✅ Cloud SQL created: $CLOUDSQL_CONNECTION" -ForegroundColor Green
}

# Check Redis
Write-Host ""
$redisExists = gcloud redis instances list --region=$REGION --filter="name=orkut-cache" --format="value(name)" 2>$null

if ($redisExists) {
    Write-Host "✅ Redis 'orkut-cache' already exists" -ForegroundColor Green
    $REDIS_HOST = gcloud redis instances describe orkut-cache --region=$REGION --format='value(host)'
} else {
    Write-Host "💾 Creating Memorystore Redis (this takes 3-5 minutes)..." -ForegroundColor Yellow
    gcloud redis instances create orkut-cache `
        --size=1 `
        --region=$REGION `
        --redis-version=redis_7_0 `
        --tier=basic
    
    $REDIS_HOST = gcloud redis instances describe orkut-cache --region=$REGION --format='value(host)'
    Write-Host "✅ Redis created: $REDIS_HOST:6379" -ForegroundColor Green
}

# Configure Secrets
Write-Host ""
Write-Host "🔐 Configuring secrets..." -ForegroundColor Yellow

$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
$GEMINI_KEY = Read-Host "Enter your Gemini API Key (or press Enter to skip)"

# Create or update secrets
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format='value(projectNumber)'

# DATABASE_URL
$dbUrl = "postgresql://orkut_user:$DB_PASSWORD@/orkut?host=/cloudsql/$CLOUDSQL_CONNECTION"
$dbUrl | gcloud secrets create DATABASE_URL --data-file=- 2>$null
if ($LASTEXITCODE -ne 0) {
    $dbUrl | gcloud secrets versions add DATABASE_URL --data-file=-
}

# REDIS_URL  
$redisUrl = "redis://$REDIS_HOST:6379/0"
$redisUrl | gcloud secrets create REDIS_URL --data-file=- 2>$null
if ($LASTEXITCODE -ne 0) {
    $redisUrl | gcloud secrets versions add REDIS_URL --data-file=-
}

# JWT_SECRET
$JWT_SECRET | gcloud secrets create JWT_SECRET --data-file=- 2>$null
if ($LASTEXITCODE -ne 0) {
    $JWT_SECRET | gcloud secrets versions add JWT_SECRET --data-file=-
}

# GEMINI_KEY
if ($GEMINI_KEY) {
    $GEMINI_KEY | gcloud secrets create GOOGLE_GEMINI_API_KEY --data-file=- 2>$null
    if ($LASTEXITCODE -ne 0) {
        $GEMINI_KEY | gcloud secrets versions add GOOGLE_GEMINI_API_KEY --data-file=-
    }
}

# Grant permissions
$serviceAccount = "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
@("DATABASE_URL", "REDIS_URL", "JWT_SECRET", "GOOGLE_GEMINI_API_KEY") | ForEach-Object {
    gcloud secrets add-iam-policy-binding $_ `
        --member="serviceAccount:$serviceAccount" `
        --role="roles/secretmanager.secretAccessor" 2>$null
}

Write-Host "✅ Secrets configured" -ForegroundColor Green

# Build images
Write-Host ""
Write-Host "🏗️ Building Docker images (5-10 minutes)..." -ForegroundColor Yellow

Write-Host "Building backend..." -ForegroundColor Cyan
gcloud builds submit --tag gcr.io/$PROJECT_ID/orkut-backend ./backend

Write-Host "Building frontend..." -ForegroundColor Cyan
gcloud builds submit --tag gcr.io/$PROJECT_ID/orkut-frontend ./frontend

Write-Host "✅ Images built successfully" -ForegroundColor Green

# Deploy Backend
Write-Host ""
Write-Host "🚀 Deploying backend to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy orkut-backend `
    --image gcr.io/$PROJECT_ID/orkut-backend `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars ENVIRONMENT=production `
    --add-cloudsql-instances $CLOUDSQL_CONNECTION `
    --set-secrets "DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,JWT_SECRET=JWT_SECRET:latest,GOOGLE_GEMINI_API_KEY=GOOGLE_GEMINI_API_KEY:latest" `
    --min-instances 0 `
    --max-instances 10 `
    --memory 512Mi `
    --cpu 1

$BACKEND_URL = gcloud run services describe orkut-backend --region=$REGION --format='value(status.url)'

# Deploy Frontend
Write-Host ""
Write-Host "🚀 Deploying frontend to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy orkut-frontend `
    --image gcr.io/$PROJECT_ID/orkut-frontend `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --min-instances 0 `
    --max-instances 5 `
    --memory 256Mi `
    --cpu 1

$FRONTEND_URL = gcloud run services describe orkut-frontend --region=$REGION --format='value(status.url)'

# Update CORS
Write-Host ""
Write-Host "🔧 Configuring CORS..." -ForegroundColor Yellow
gcloud run services update orkut-backend `
    --region $REGION `
    --set-env-vars "CORS_ORIGINS=$FRONTEND_URL"

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "Frontend:  $FRONTEND_URL" -ForegroundColor White
Write-Host "Backend:   $BACKEND_URL" -ForegroundColor White
Write-Host "API Docs:  $BACKEND_URL/docs" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "1. Run migrations:" -ForegroundColor White
Write-Host "   .\run-migrations-gcp.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test your application:" -ForegroundColor White
Write-Host "   curl $BACKEND_URL/health" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open in browser:" -ForegroundColor White
Write-Host "   start $FRONTEND_URL" -ForegroundColor Gray
Write-Host ""
