# 🛠️ Comandos Úteis - GCP Cloud Run

## 📊 Monitoramento

### Ver Logs
```bash
# Backend logs (últimas 50 linhas)
gcloud run logs read orkut-backend --region=us-central1 --limit=50

# Frontend logs
gcloud run logs read orkut-frontend --region=us-central1 --limit=50

# Logs em tempo real
gcloud run logs tail orkut-backend --region=us-central1

# Filtrar por erro
gcloud run logs read orkut-backend --region=us-central1 --filter="severity=ERROR"
```

### Status dos Serviços
```bash
# Listar todos os serviços
gcloud run services list --region=us-central1

# Detalhes do backend
gcloud run services describe orkut-backend --region=us-central1

# Obter URL
gcloud run services describe orkut-backend --region=us-central1 --format='value(status.url)'
```

### Métricas
```bash
# Abrir no Cloud Console
gcloud run services describe orkut-backend --region=us-central1 --format='value(status.url)' | xargs -I {} echo "https://console.cloud.google.com/run/detail/us-central1/orkut-backend/metrics"
```

## 🔄 Deploy e Atualizações

### Rebuild e Deploy
```bash
# Backend
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/orkut-backend ./backend
gcloud run deploy orkut-backend --image gcr.io/$(gcloud config get-value project)/orkut-backend --region=us-central1

# Frontend
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/orkut-frontend ./frontend
gcloud run deploy orkut-frontend --image gcr.io/$(gcloud config get-value project)/orkut-frontend --region=us-central1
```

### Deploy via Cloud Build
```bash
gcloud builds submit --config=cloudbuild.yaml
```

### Atualizar Variáveis de Ambiente
```bash
# Adicionar/atualizar variável
gcloud run services update orkut-backend \
    --region=us-central1 \
    --set-env-vars NEW_VAR=value

# Atualizar secret
echo -n "novo-valor" | gcloud secrets versions add SECRET_NAME --data-file=-
```

## 🗄️ Banco de Dados

### Conectar ao Cloud SQL
```bash
# Via Cloud SQL Proxy
cloud-sql-proxy $(gcloud sql instances describe orkut-db --format='value(connectionName)')

# Em outro terminal
psql "host=127.0.0.1 port=5432 dbname=orkut user=orkut_user"
```

### Executar Migrations
```bash
bash scripts/run-migrations-gcp.sh
```

### Backup Manual
```bash
# Criar backup
gcloud sql backups create --instance=orkut-db

# Listar backups
gcloud sql backups list --instance=orkut-db

# Restaurar backup
gcloud sql backups restore BACKUP_ID --backup-instance=orkut-db --backup-instance=orkut-db
```

### Exportar Dados
```bash
# Criar bucket (se não existir)
gsutil mb gs://orkut-backups

# Exportar
gcloud sql export sql orkut-db gs://orkut-backups/backup-$(date +%Y%m%d).sql \
    --database=orkut
```

## 💾 Redis (Memorystore)

### Status
```bash
gcloud redis instances describe orkut-cache --region=us-central1
```

### Conectar (via VM com VPC)
```bash
# Obter host
REDIS_HOST=$(gcloud redis instances describe orkut-cache --region=us-central1 --format='value(host)')

# Conectar via redis-cli (precisa estar na mesma VPC)
redis-cli -h $REDIS_HOST
```

### Flush Cache
```bash
# Via backend endpoint (criar endpoint admin)
curl -X POST https://seu-backend.run.app/admin/cache/flush \
    -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 🔐 Secrets

### Listar Secrets
```bash
gcloud secrets list
```

### Ver Valor de Secret
```bash
gcloud secrets versions access latest --secret=JWT_SECRET
```

### Atualizar Secret
```bash
echo -n "novo-valor" | gcloud secrets versions add SECRET_NAME --data-file=-
```

### Deletar Secret
```bash
gcloud secrets delete SECRET_NAME
```

## 📈 Escala

### Ajustar Instâncias
```bash
# Aumentar mínimo de instâncias
gcloud run services update orkut-backend \
    --region=us-central1 \
    --min-instances=2 \
    --max-instances=20

# Reduzir para economizar
gcloud run services update orkut-backend \
    --region=us-central1 \
    --min-instances=0 \
    --max-instances=5
```

### Ajustar Recursos
```bash
# Aumentar memória e CPU
gcloud run services update orkut-backend \
    --region=us-central1 \
    --memory=1Gi \
    --cpu=2

# Ajustar timeout
gcloud run services update orkut-backend \
    --region=us-central1 \
    --timeout=300
```

### Ajustar Concorrência
```bash
gcloud run services update orkut-backend \
    --region=us-central1 \
    --concurrency=80
```

## 🔄 Rollback

### Listar Revisões
```bash
gcloud run revisions list --service=orkut-backend --region=us-central1
```

### Fazer Rollback
```bash
# Para revisão específica
gcloud run services update-traffic orkut-backend \
    --region=us-central1 \
    --to-revisions=orkut-backend-00001-abc=100

# Para última revisão estável
gcloud run services update-traffic orkut-backend \
    --region=us-central1 \
    --to-latest
```

### Canary Deploy (Gradual)
```bash
# 10% para nova versão, 90% para antiga
gcloud run services update-traffic orkut-backend \
    --region=us-central1 \
    --to-revisions=orkut-backend-00002-xyz=10,orkut-backend-00001-abc=90
```

## 🧪 Testes

### Health Check
```bash
BACKEND_URL=$(gcloud run services describe orkut-backend --region=us-central1 --format='value(status.url)')
curl $BACKEND_URL/health
```

### Teste de Carga
```bash
# Instalar hey
go install github.com/rakyll/hey@latest

# Executar teste
hey -n 1000 -c 10 $BACKEND_URL/health
```

## 🔍 Debug

### Executar Comando no Container
```bash
# Não é possível SSH direto no Cloud Run
# Use Cloud Run Jobs para debug

gcloud run jobs create debug-job \
    --image gcr.io/$(gcloud config get-value project)/orkut-backend \
    --region=us-central1 \
    --command=/bin/bash \
    --args=-c,"python -c 'import sys; print(sys.version)'"

gcloud run jobs execute debug-job --region=us-central1
```

### Ver Variáveis de Ambiente
```bash
gcloud run services describe orkut-backend \
    --region=us-central1 \
    --format='value(spec.template.spec.containers[0].env)'
```

## 💰 Custos

### Ver Custos Estimados
```bash
# Abrir billing
gcloud alpha billing accounts list
gcloud alpha billing projects describe $(gcloud config get-value project)
```

### Otimizar Custos
```bash
# Reduzir instâncias mínimas para 0
gcloud run services update orkut-backend --region=us-central1 --min-instances=0

# Usar tier menor do Cloud SQL
gcloud sql instances patch orkut-db --tier=db-f1-micro

# Reduzir Redis
gcloud redis instances update orkut-cache --region=us-central1 --size=1
```

## 🗑️ Limpeza

### Deletar Tudo
```bash
# CUIDADO! Isso deleta tudo

# Deletar serviços Cloud Run
gcloud run services delete orkut-backend --region=us-central1 --quiet
gcloud run services delete orkut-frontend --region=us-central1 --quiet

# Deletar Cloud SQL
gcloud sql instances delete orkut-db --quiet

# Deletar Redis
gcloud redis instances delete orkut-cache --region=us-central1 --quiet

# Deletar secrets
gcloud secrets delete DATABASE_URL --quiet
gcloud secrets delete REDIS_URL --quiet
gcloud secrets delete JWT_SECRET --quiet
gcloud secrets delete GOOGLE_GEMINI_API_KEY --quiet

# Deletar imagens
gcloud container images delete gcr.io/$(gcloud config get-value project)/orkut-backend --quiet
gcloud container images delete gcr.io/$(gcloud config get-value project)/orkut-frontend --quiet
```

## 🌐 Domínio Customizado

### Mapear Domínio
```bash
# Frontend
gcloud run domain-mappings create \
    --service=orkut-frontend \
    --domain=seu-dominio.com \
    --region=us-central1

# Backend (API)
gcloud run domain-mappings create \
    --service=orkut-backend \
    --domain=api.seu-dominio.com \
    --region=us-central1
```

### Verificar Status
```bash
gcloud run domain-mappings describe \
    --domain=seu-dominio.com \
    --region=us-central1
```

## 📊 Alertas

### Criar Alerta de Erro
```bash
# Via Cloud Console é mais fácil
# Monitoring > Alerting > Create Policy
```

## 🔒 Segurança

### Restringir Acesso
```bash
# Remover acesso público
gcloud run services update orkut-backend \
    --region=us-central1 \
    --no-allow-unauthenticated

# Adicionar IAM binding para usuário específico
gcloud run services add-iam-policy-binding orkut-backend \
    --region=us-central1 \
    --member="user:email@example.com" \
    --role="roles/run.invoker"
```

### Configurar Identity-Aware Proxy
```bash
# Requer configuração adicional no Cloud Console
# https://cloud.google.com/iap/docs/enabling-cloud-run
```

---

## 📚 Recursos Úteis

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference/run)
- [Cloud Console](https://console.cloud.google.com/run)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
