#!/bin/bash

echo "🗄️ Executando Migrations no GCP Cloud Run"
echo "=========================================="

# Configurações
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Projeto GCP não configurado"
    echo "Execute: gcloud config set project SEU_PROJECT_ID"
    exit 1
fi

echo "Projeto: $PROJECT_ID"
echo "Região: $REGION"
echo ""

# Obter connection name do Cloud SQL
CLOUDSQL_CONNECTION=$(gcloud sql instances describe orkut-db --format='value(connectionName)')

if [ -z "$CLOUDSQL_CONNECTION" ]; then
    echo "❌ Instância Cloud SQL 'orkut-db' não encontrada"
    exit 1
fi

echo "Cloud SQL: $CLOUDSQL_CONNECTION"
echo ""

# Opção 1: Via Cloud Run Job (Recomendado)
echo "📦 Criando Cloud Run Job para migrations..."

gcloud run jobs create orkut-migrate \
    --image gcr.io/$PROJECT_ID/orkut-backend \
    --region $REGION \
    --add-cloudsql-instances $CLOUDSQL_CONNECTION \
    --set-secrets DATABASE_URL=DATABASE_URL:latest \
    --command alembic \
    --args upgrade,head \
    --max-retries 3 \
    --task-timeout 5m \
    || echo "Job já existe, atualizando..."

# Se já existe, atualiza
gcloud run jobs update orkut-migrate \
    --image gcr.io/$PROJECT_ID/orkut-backend \
    --region $REGION \
    --add-cloudsql-instances $CLOUDSQL_CONNECTION \
    --set-secrets DATABASE_URL=DATABASE_URL:latest \
    --command alembic \
    --args upgrade,head \
    2>/dev/null || true

echo ""
echo "🚀 Executando migrations..."
gcloud run jobs execute orkut-migrate --region $REGION --wait

echo ""
echo "✅ Migrations executadas com sucesso!"
echo ""
echo "Para ver logs:"
echo "gcloud run jobs executions logs read --job orkut-migrate --region $REGION"
