# ✅ Checklist de Deploy - GCP Cloud Run

## 📋 Pré-Deploy

### Conta e Projeto
- [ ] Conta GCP criada
- [ ] Billing ativado
- [ ] Projeto criado (ex: `orkut-2-0-prod`)
- [ ] Google Cloud CLI instalado
- [ ] Autenticado: `gcloud auth login`

### Código
- [ ] Código commitado no Git
- [ ] Testes passando localmente
- [ ] `.env.example` atualizado
- [ ] Dockerfiles testados localmente
- [ ] `docker-compose.yml` funcionando

### APIs e Chaves
- [ ] Gemini API Key obtida: https://makersuite.google.com/app/apikey
- [ ] APIs GCP habilitadas (script faz isso)

## 🚀 Deploy Inicial

### 1. Executar Script de Deploy
```bash
bash scripts/deploy-gcp.sh
```

**O script vai:**
- [ ] Habilitar APIs necessárias
- [ ] Criar Cloud SQL (PostgreSQL)
- [ ] Criar Memorystore (Redis)
- [ ] Criar VPC Connector
- [ ] Configurar Secrets
- [ ] Build imagens Docker
- [ ] Deploy Backend
- [ ] Deploy Frontend
- [ ] Configurar CORS

**Tempo estimado:** 15-20 minutos

### 2. Executar Migrations
```bash
bash scripts/run-migrations-gcp.sh
```

### 3. Testar Aplicação
```bash
# Obter URLs
BACKEND_URL=$(gcloud run services describe orkut-backend --region=us-central1 --format='value(status.url)')
FRONTEND_URL=$(gcloud run services describe orkut-frontend --region=us-central1 --format='value(status.url)')

# Testar backend
curl $BACKEND_URL/health

# Testar API docs
open $BACKEND_URL/docs

# Testar frontend
open $FRONTEND_URL
```

## 🔧 Configuração Pós-Deploy

### GitHub Actions (Deploy Automático)
- [ ] Criar Service Account para GitHub
- [ ] Gerar chave JSON
- [ ] Adicionar secrets no GitHub:
  - `GCP_PROJECT_ID`
  - `GCP_SA_KEY`
  - `CLOUDSQL_INSTANCE`
- [ ] Testar workflow com release

**Comandos:**
```bash
# Criar service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions"

# Dar permissões
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member="serviceAccount:github-actions@$(gcloud config get-value project).iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member="serviceAccount:github-actions@$(gcloud config get-value project).iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member="serviceAccount:github-actions@$(gcloud config get-value project).iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

# Criar chave
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@$(gcloud config get-value project).iam.gserviceaccount.com
```

### Domínio Customizado (Opcional)
- [ ] Domínio registrado
- [ ] Mapear domínio no Cloud Run
- [ ] Configurar DNS
- [ ] SSL automático configurado

**Comandos:**
```bash
# Mapear frontend
gcloud run domain-mappings create \
    --service=orkut-frontend \
    --domain=seu-dominio.com \
    --region=us-central1

# Mapear backend
gcloud run domain-mappings create \
    --service=orkut-backend \
    --domain=api.seu-dominio.com \
    --region=us-central1

# Seguir instruções para configurar DNS
```

### Monitoramento
- [ ] Configurar alertas de erro
- [ ] Configurar alertas de latência
- [ ] Configurar alertas de custo
- [ ] Integrar Sentry (opcional)

**Via Cloud Console:**
1. Monitoring > Alerting > Create Policy
2. Configurar notificações por email

### Backups
- [ ] Backups automáticos do Cloud SQL ativados (script faz isso)
- [ ] Testar restore de backup
- [ ] Configurar retenção de backups

**Comandos:**
```bash
# Verificar backups
gcloud sql backups list --instance=orkut-db

# Criar backup manual
gcloud sql backups create --instance=orkut-db
```

## 🔐 Segurança

### Secrets
- [ ] JWT_SECRET gerado com `openssl rand -hex 32`
- [ ] Senhas fortes para banco de dados
- [ ] Gemini API Key configurada
- [ ] Secrets não commitados no Git

### CORS
- [ ] CORS configurado com domínios corretos
- [ ] Testar de diferentes origens

### Rate Limiting (Implementar)
- [ ] Rate limiting no backend
- [ ] Cloud Armor configurado (opcional)

## 📊 Performance

### Otimizações
- [ ] Min instances configurado (1 para backend, 0 para frontend)
- [ ] Max instances configurado
- [ ] Memória e CPU ajustados
- [ ] Timeout configurado
- [ ] Concorrência ajustada

**Comandos:**
```bash
# Backend (sempre ligado)
gcloud run services update orkut-backend \
    --region=us-central1 \
    --min-instances=1 \
    --max-instances=10 \
    --memory=512Mi \
    --cpu=1

# Frontend (escala para zero)
gcloud run services update orkut-frontend \
    --region=us-central1 \
    --min-instances=0 \
    --max-instances=5 \
    --memory=256Mi \
    --cpu=1
```

### Cache
- [ ] Redis funcionando
- [ ] Cache hit rate monitorado
- [ ] TTL configurado corretamente

## 💰 Custos

### Otimização
- [ ] Revisar tier do Cloud SQL (db-f1-micro para dev)
- [ ] Revisar tamanho do Redis (1GB para dev)
- [ ] Min instances = 0 para serviços não críticos
- [ ] Configurar alertas de custo

**Custos Estimados:**
- **Desenvolvimento:** ~$37/mês
- **Produção (baixo tráfego):** ~$90/mês
- **Produção (médio tráfego):** ~$200/mês

### Monitorar Custos
```bash
# Ver billing
gcloud alpha billing accounts list

# Configurar budget alert no Cloud Console
# Billing > Budgets & alerts
```

## 🧪 Testes em Produção

### Smoke Tests
- [ ] Health check: `/health`
- [ ] API docs: `/docs`
- [ ] Criar usuário
- [ ] Login
- [ ] Criar post
- [ ] Chat funcionando
- [ ] Gemini API funcionando

### Load Testing
```bash
# Instalar hey
go install github.com/rakyll/hey@latest

# Teste básico
hey -n 1000 -c 10 $BACKEND_URL/health

# Teste de endpoint
hey -n 100 -c 5 -m POST -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}' \
    $BACKEND_URL/api/auth/login
```

## 📝 Documentação

### Atualizar
- [ ] README.md com URLs de produção
- [ ] API docs atualizadas
- [ ] Variáveis de ambiente documentadas
- [ ] Runbook de incidentes criado

### Compartilhar
- [ ] URLs compartilhadas com time
- [ ] Credenciais de admin criadas
- [ ] Acesso ao Cloud Console configurado

## 🚨 Plano de Rollback

### Preparar
- [ ] Documentar processo de rollback
- [ ] Testar rollback em staging
- [ ] Ter backup recente

**Rollback Rápido:**
```bash
# Listar revisões
gcloud run revisions list --service=orkut-backend --region=us-central1

# Voltar para revisão anterior
gcloud run services update-traffic orkut-backend \
    --region=us-central1 \
    --to-revisions=REVISION_NAME=100
```

## 📞 Suporte

### Contatos
- [ ] Lista de contatos de emergência
- [ ] Acesso ao Cloud Console compartilhado
- [ ] Documentação de troubleshooting

### Recursos
- [ ] GCP Support ativado (se necessário)
- [ ] Sentry configurado
- [ ] Logs centralizados

## ✅ Deploy Completo!

Quando todos os itens estiverem marcados:

1. ✅ Aplicação rodando em produção
2. ✅ Monitoramento ativo
3. ✅ Backups configurados
4. ✅ CI/CD funcionando
5. ✅ Documentação atualizada

**Próximos passos:**
- Monitorar logs e métricas
- Coletar feedback de usuários
- Iterar e melhorar
- Escalar conforme necessário

---

## 📚 Referências Rápidas

- [GCP-SETUP.md](./GCP-SETUP.md) - Guia detalhado
- [GCP-COMMANDS.md](./GCP-COMMANDS.md) - Comandos úteis
- [DEPLOY.md](./DEPLOY.md) - Opções de deploy
- [Cloud Console](https://console.cloud.google.com)

**Dúvidas?** Veja a documentação ou abra uma issue!
