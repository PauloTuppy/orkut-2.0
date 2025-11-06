# Run database migrations on GCP Cloud Run

$PROJECT_ID = "orkut-2"
$REGION = "us-central1"

Write-Host "🗄️ Running Database Migrations on GCP Cloud Run" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Get Cloud SQL connection
$CLOUDSQL_CONNECTION = gcloud sql instances describe orkut-db --format='value(connectionName)'

if (!$CLOUDSQL_CONNECTION) {
    Write-Host "❌ Cloud SQL instance 'orkut-db' not found" -ForegroundColor Red
    exit 1
}

Write-Host "Cloud SQL: $CLOUDSQL_CONNECTION" -ForegroundColor Cyan
Write-Host ""

# Create or update Cloud Run Job
Write-Host "📦 Creating Cloud Run Job for migrations..." -ForegroundColor Yellow

gcloud run jobs create orkut-migrate `
    --image gcr.io/$PROJECT_ID/orkut-backend `
    --region $REGION `
    --add-cloudsql-instances $CLOUDSQL_CONNECTION `
    --set-secrets "DATABASE_URL=DATABASE_URL:latest" `
    --command alembic `
    --args "upgrade,head" `
    --max-retries 3 `
    --task-timeout 5m 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Job already exists, updating..." -ForegroundColor Yellow
    gcloud run jobs update orkut-migrate `
        --image gcr.io/$PROJECT_ID/orkut-backend `
        --region $REGION `
        --add-cloudsql-instances $CLOUDSQL_CONNECTION `
        --set-secrets "DATABASE_URL=DATABASE_URL:latest" `
        --command alembic `
        --args "upgrade,head"
}

Write-Host ""
Write-Host "🚀 Executing migrations..." -ForegroundColor Yellow
gcloud run jobs execute orkut-migrate --region $REGION --wait

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Check logs:" -ForegroundColor Red
    Write-Host "gcloud run jobs executions logs read --job orkut-migrate --region $REGION" -ForegroundColor Gray
}
