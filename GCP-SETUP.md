# 🚀 Deploy no GCP Cloud Run - Guia Completo

## 📋 Pré-requisitos

1. Conta GCP com billing ativado
2. Google Cloud CLI instalado
3. Repositório Git configurado

## 🔧 Instalação do Google Cloud CLI

### Windows
```powershell
# Via Chocolatey
choco install gcloudsdk

# Ou baixe o instalador
# https://cloud.google.com/sdk/docs/install
```

### Verificar instalação
```bash
gcloud --version
```

## 🎯 Setup Inicial (Passo a Passo)

### 1. Criar e Configurar Projeto

```bash
# Login
gcloud auth login

# Criar projeto (escolha um ID único)
gcloud projects create orkut-2-0-prod --name="Orkut 2.0"

# Configurar projeto
gcloud config set project orkut-2-0-prod

# Habilitar billing (necessário)
# Acesse: https://console.cloud.google.com/billing
```

### 2. Habilitar APIs Necessárias

```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    secretmanager.googleapis.com \
    compute.googleapis.com \
    vpcaccess.googleapis.com \
    aiplatform.googleapis.com
```

### 3. Criar Cloud SQL (PostgreSQL)

```bash
# Criar instância
gcloud sql instances create orkut-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=$(openssl rand -base64 32) \
    --backup \
    --backup-start-time=03:00

# Criar banco de dados
gcloud sql databases create orkut \
    --instance=orkut-db

# Criar usuário
gcloud sql users create orkut_user \
    --instance=orkut-db \
    --password=$(openssl rand -base64 32)

# Obter connection name
gcloud sql instances describe orkut-db --format='value(connectionName)'
# Salve este valor: PROJECT_ID:REGION:INSTANCE_NAME
```

### 4. Criar Memorystore (Redis)

```bash
# Criar VPC Connector (necessário para Redis)
gcloud compute networks vpc-access connectors create orkut-connector \
    --region=us-central1 \
    --range=10.8.0.0/28

# Criar instância Redis
gcloud redis instances create orkut-cache \
    --size=1 \
    --region=us-central1 \
    --redis-version=redis_7_0 \
    --tier=basic

# Obter host e porta
gcloud redis instances describe orkut-cache \
    --region=us-central1 \
    --format='value(host,port)'
```

### 5. Configurar Secrets

```bash
# Gerar JWT Secret
JWT_SECRET=$(openssl rand -hex 32)

# Criar secrets
echo -n "postgresql://orkut_user:SUA_SENHA@/orkut?host=/cloudsql/PROJECT_ID:REGION:orkut-db" | \
    gcloud secrets create DATABASE_URL --data-file=-

echo -n "redis://REDIS_HOST:6379/0" | \
    gcloud secrets create REDIS_URL --data-file=-

echo -n "$JWT_SECRET" | \
    gcloud secrets create JWT_SECRET --data-file=-

echo -n "SUA_GEMINI_API_KEY" | \
    gcloud secrets create GOOGLE_GEMINI_API_KEY --data-file=-

# Dar permissão ao Cloud Run
PROJECT_NUMBER=$(gcloud projects describe orkut-2-0-prod --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding DATABASE_URL \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding REDIS_URL \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding JWT_SECRET \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding GOOGLE_GEMINI_API_KEY \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 6. Build e Deploy Manual (Primeira vez)

```bash
# Build imagens
gcloud builds submit --tag gcr.io/orkut-2-0-prod/orkut-backend ./backend
gcloud builds submit --tag gcr.io/orkut-2-0-prod/orkut-frontend ./frontend

# Deploy Backend
gcloud run deploy orkut-backend \
    --image gcr.io/orkut-2-0-prod/orkut-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars ENVIRONMENT=production \
    --add-cloudsql-instances orkut-2-0-prod:us-central1:orkut-db \
    --set-secrets DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,JWT_SECRET=JWT_SECRET:latest,GOOGLE_GEMINI_API_KEY=GOOGLE_GEMINI_API_KEY:latest \
    --vpc-connector orkut-connector \
    --min-instances 1 \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1

# Obter URL do backend
BACKEND_URL=$(gcloud run services describe orkut-backend --region=us-central1 --format='value(status.url)')
echo "Backend URL: $BACKEND_URL"

# Deploy Frontend
gcloud run deploy orkut-frontend \
    --image gcr.io/orkut-2-0-prod/orkut-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 5 \
    --memory 256Mi \
    --cpu 1

# Obter URL do frontend
FRONTEND_URL=$(gcloud run services describe orkut-frontend --region=us-central1 --format='value(status.url)')
echo "Frontend URL: $FRONTEND_URL"
```

### 7. Executar Migrations

```bash
# Conectar ao Cloud SQL via proxy
cloud-sql-proxy orkut-2-0-prod:us-central1:orkut-db &

# Em outro terminal, executar migrations
cd backend
export DATABASE_URL="postgresql://orkut_user:SENHA@localhost:5432/orkut"
alembic upgrade head
```

### 8. Configurar CORS

```bash
# Atualizar secret com URL do frontend
gcloud secrets versions add DATABASE_URL \
    --data-file=- <<EOF
postgresql://orkut_user:SENHA@/orkut?host=/cloudsql/orkut-2-0-prod:us-central1:orkut-db
EOF

# Atualizar backend com CORS
gcloud run services update orkut-backend \
    --region us-central1 \
    --set-env-vars CORS_ORIGINS=$FRONTEND_URL
```

## 🔄 Deploy Automático via GitHub Actions

### 1. Criar Service Account

```bash
# Criar service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions"

# Dar permissões
gcloud projects add-iam-policy-binding orkut-2-0-prod \
    --member="serviceAccount:github-actions@orkut-2-0-prod.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding orkut-2-0-prod \
    --member="serviceAccount:github-actions@orkut-2-0-prod.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding orkut-2-0-prod \
    --member="serviceAccount:github-actions@orkut-2-0-prod.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

# Criar chave JSON
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@orkut-2-0-prod.iam.gserviceaccount.com
```

### 2. Configurar GitHub Secrets

Vá em: `Settings > Secrets and variables > Actions`

Adicione:
- `GCP_PROJECT_ID`: orkut-2-0-prod
- `GCP_SA_KEY`: conteúdo do arquivo `github-actions-key.json`
- `CLOUDSQL_INSTANCE`: orkut-2-0-prod:us-central1:orkut-db

### 3. Atualizar Workflow

O arquivo `.github/workflows/ci.yml` já está configurado. Atualize a seção de deploy:

```yaml
deploy-production:
  runs-on: ubuntu-latest
  needs: docker-build
  if: github.event_name == 'release'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud builds submit --config=cloudbuild.yaml \
          --substitutions=_CLOUDSQL_INSTANCE=${{ secrets.CLOUDSQL_INSTANCE }}
```

## 📊 Monitoramento

### Logs

```bash
# Backend logs
gcloud run logs read orkut-backend --region=us-central1 --limit=50

# Frontend logs
gcloud run logs read orkut-frontend --region=us-central1 --limit=50

# Logs em tempo real
gcloud run logs tail orkut-backend --region=us-central1
```

### Métricas

```bash
# Abrir Cloud Console
gcloud run services describe orkut-backend --region=us-central1

# Ou acesse: https://console.cloud.google.com/run
```

## 💰 Custos Estimados

### Tier Gratuito (Desenvolvimento)
- Cloud Run: 2 milhões de requests/mês grátis
- Cloud SQL: db-f1-micro ~$7/mês
- Memorystore: Basic 1GB ~$30/mês
- **Total: ~$37/mês**

### Produção (Tráfego Médio)
- Cloud Run: ~$10-30/mês
- Cloud SQL: db-g1-small ~$25/mês
- Memorystore: Standard 1GB ~$50/mês
- Cloud Build: ~$5/mês
- **Total: ~$90-110/mês**

## 🔐 Segurança

### Configurar Firewall

```bash
# Permitir apenas Cloud Run acessar Cloud SQL
gcloud sql instances patch orkut-db \
    --authorized-networks=0.0.0.0/0 \
    --no-assign-ip
```

### Configurar Identity-Aware Proxy (Opcional)

```bash
# Para proteger endpoints admin
gcloud run services update orkut-backend \
    --region us-central1 \
    --no-allow-unauthenticated
```

## 🚀 Domínio Customizado

```bash
# Mapear domínio
gcloud run domain-mappings create \
    --service orkut-frontend \
    --domain seu-dominio.com \
    --region us-central1

# Seguir instruções para configurar DNS
```

## 🔄 Rollback

```bash
# Listar revisões
gcloud run revisions list --service orkut-backend --region us-central1

# Fazer rollback
gcloud run services update-traffic orkut-backend \
    --region us-central1 \
    --to-revisions REVISION_NAME=100
```

## 🧪 Testar Deploy

```bash
# Health check
curl https://orkut-backend-HASH-uc.a.run.app/health

# API docs
curl https://orkut-backend-HASH-uc.a.run.app/docs

# Frontend
curl https://orkut-frontend-HASH-uc.a.run.app
```

## 📚 Recursos Úteis

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud SQL Docs](https://cloud.google.com/sql/docs)
- [Memorystore Docs](https://cloud.google.com/memorystore/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

## 🆘 Troubleshooting

### Erro de conexão com Cloud SQL
```bash
# Verificar proxy
cloud-sql-proxy orkut-2-0-prod:us-central1:orkut-db
```

### Erro de memória
```bash
# Aumentar memória
gcloud run services update orkut-backend \
    --region us-central1 \
    --memory 1Gi
```

### Erro de timeout
```bash
# Aumentar timeout
gcloud run services update orkut-backend \
    --region us-central1 \
    --timeout 300
```

---

Pronto! Sua aplicação está rodando no GCP Cloud Run com escala automática! 🎉
