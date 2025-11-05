#!/bin/bash

echo "🚀 Deploy Orkut 2.0 para GCP Cloud Run"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para perguntar
ask() {
    read -p "$1 " response
    echo $response
}

# Configurações
echo "📝 Configuração inicial"
echo "----------------------"
PROJECT_ID=$(ask "Digite o ID do projeto GCP (ex: orkut-2-0-prod):")
REGION="us-central1"

# Verifica se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI não encontrado.${NC}"
    echo "Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Login e configuração
echo ""
echo "🔐 Configurando projeto GCP..."
gcloud auth login
gcloud config set project $PROJECT_ID

# Habilita APIs necessárias
echo ""
echo "🔧 Habilitando APIs (pode levar alguns minutos)..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    secretmanager.googleapis.com \
    compute.googleapis.com \
    vpcaccess.googleapis.com \
    aiplatform.googleapis.com

# Cria Cloud SQL
echo ""
echo "🗄️ Criando Cloud SQL (PostgreSQL)..."
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql instances create orkut-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$DB_PASSWORD \
    --backup \
    --backup-start-time=03:00

gcloud sql databases create orkut --instance=orkut-db
gcloud sql users create orkut_user --instance=orkut-db --password=$DB_PASSWORD

CLOUDSQL_CONNECTION=$(gcloud sql instances describe orkut-db --format='value(connectionName)')
echo -e "${GREEN}✓ Cloud SQL criado: $CLOUDSQL_CONNECTION${NC}"

# Cria VPC Connector
echo ""
echo "🌐 Criando VPC Connector..."
gcloud compute networks vpc-access connectors create orkut-connector \
    --region=$REGION \
    --range=10.8.0.0/28 \
    || echo "VPC Connector já existe ou erro na criação"

# Cria Memorystore (Redis)
echo ""
echo "💾 Criando Memorystore (Redis)..."
gcloud redis instances create orkut-cache \
    --size=1 \
    --region=$REGION \
    --redis-version=redis_7_0 \
    --tier=basic

REDIS_HOST=$(gcloud redis instances describe orkut-cache --region=$REGION --format='value(host)')
echo -e "${GREEN}✓ Redis criado: $REDIS_HOST:6379${NC}"

# Configura Secrets
echo ""
echo "🔐 Configurando secrets..."
JWT_SECRET=$(openssl rand -hex 32)
GEMINI_KEY=$(ask "Digite sua Gemini API Key (ou deixe vazio para configurar depois):")

echo -n "postgresql://orkut_user:$DB_PASSWORD@/orkut?host=/cloudsql/$CLOUDSQL_CONNECTION" | \
    gcloud secrets create DATABASE_URL --data-file=- || \
    echo -n "postgresql://orkut_user:$DB_PASSWORD@/orkut?host=/cloudsql/$CLOUDSQL_CONNECTION" | \
    gcloud secrets versions add DATABASE_URL --data-file=-

echo -n "redis://$REDIS_HOST:6379/0" | \
    gcloud secrets create REDIS_URL --data-file=- || \
    echo -n "redis://$REDIS_HOST:6379/0" | \
    gcloud secrets versions add REDIS_URL --data-file=-

echo -n "$JWT_SECRET" | \
    gcloud secrets create JWT_SECRET --data-file=- || \
    echo -n "$JWT_SECRET" | \
    gcloud secrets versions add JWT_SECRET --data-file=-

if [ ! -z "$GEMINI_KEY" ]; then
    echo -n "$GEMINI_KEY" | \
        gcloud secrets create GOOGLE_GEMINI_API_KEY --data-file=- || \
        echo -n "$GEMINI_KEY" | \
        gcloud secrets versions add GOOGLE_GEMINI_API_KEY --data-file=-
fi

# Dar permissões
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
for secret in DATABASE_URL REDIS_URL JWT_SECRET GOOGLE_GEMINI_API_KEY; do
    gcloud secrets add-iam-policy-binding $secret \
        --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor" 2>/dev/null || true
done

echo -e "${GREEN}✓ Secrets configurados${NC}"

# Build imagens
echo ""
echo "🏗️ Construindo imagens Docker (pode levar 5-10 minutos)..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/orkut-backend ./backend &
BACKEND_BUILD_PID=$!
gcloud builds submit --tag gcr.io/$PROJECT_ID/orkut-frontend ./frontend &
FRONTEND_BUILD_PID=$!

wait $BACKEND_BUILD_PID
wait $FRONTEND_BUILD_PID

echo -e "${GREEN}✓ Imagens construídas${NC}"

# Deploy Backend
echo ""
echo "🚀 Fazendo deploy do backend..."
gcloud run deploy orkut-backend \
    --image gcr.io/$PROJECT_ID/orkut-backend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars ENVIRONMENT=production \
    --add-cloudsql-instances $CLOUDSQL_CONNECTION \
    --set-secrets DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,JWT_SECRET=JWT_SECRET:latest,GOOGLE_GEMINI_API_KEY=GOOGLE_GEMINI_API_KEY:latest \
    --vpc-connector orkut-connector \
    --min-instances 1 \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1

BACKEND_URL=$(gcloud run services describe orkut-backend --region=$REGION --format='value(status.url)')

# Deploy Frontend
echo ""
echo "🚀 Fazendo deploy do frontend..."
gcloud run deploy orkut-frontend \
    --image gcr.io/$PROJECT_ID/orkut-frontend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 5 \
    --memory 256Mi \
    --cpu 1

FRONTEND_URL=$(gcloud run services describe orkut-frontend --region=$REGION --format='value(status.url)')

# Atualizar CORS
echo ""
echo "🔧 Configurando CORS..."
gcloud run services update orkut-backend \
    --region $REGION \
    --set-env-vars CORS_ORIGINS=$FRONTEND_URL

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🌐 URLs da Aplicação:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend:  $FRONTEND_URL"
echo "Backend:   $BACKEND_URL"
echo "API Docs:  $BACKEND_URL/docs"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Executar migrations:"
echo "   gcloud run jobs create orkut-migrate \\"
echo "     --image gcr.io/$PROJECT_ID/orkut-backend \\"
echo "     --region $REGION \\"
echo "     --add-cloudsql-instances $CLOUDSQL_CONNECTION \\"
echo "     --set-secrets DATABASE_URL=DATABASE_URL:latest \\"
echo "     --command alembic,upgrade,head"
echo ""
echo "2. Configurar domínio customizado (opcional)"
echo "3. Configurar monitoramento no Cloud Console"
echo "4. Configurar GitHub Actions para deploy automático"
echo ""
echo "Veja GCP-SETUP.md para mais detalhes!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
