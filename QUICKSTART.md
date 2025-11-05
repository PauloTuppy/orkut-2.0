# ⚡ Quickstart - Orkut 2.0

## 🎯 Deploy em 5 Minutos (Railway)

```bash
# 1. Instale Railway CLI
npm install -g @railway/cli

# 2. Execute script de deploy
bash scripts/deploy-railway.sh

# 3. Configure variáveis no dashboard
# https://railway.app/dashboard
```

**Pronto!** Sua aplicação está no ar.

---

## 🏠 Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/orkut-2.0.git
cd orkut-2.0

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# 3. Inicie com Docker Compose
docker compose up -d

# 4. Execute migrations
docker compose exec backend alembic upgrade head

# 5. Acesse
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Docs API: http://localhost:8000/docs
```

---

## 🧪 Testar Gemini API

```bash
# 1. Obtenha API Key
# https://makersuite.google.com/app/apikey

# 2. Adicione ao .env
GOOGLE_GEMINI_API_KEY=sua-chave-aqui

# 3. Teste endpoint
curl -X POST http://localhost:8000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Seu texto aqui..."}'
```

---

## 🚀 Deploy Produção

### Opção 1: Railway (Mais Fácil)
```bash
bash scripts/deploy-railway.sh
```

### Opção 2: GCP Cloud Run (Mais Escalável)
```bash
# Edite PROJECT_ID no script
bash scripts/deploy-gcp.sh
```

### Opção 3: VM Ubuntu (Mais Controle)
```bash
# SSH na VM
ssh root@seu-ip

# Execute setup
bash scripts/setup-vm.sh
```

---

## 📊 Verificar Status

```bash
# Logs
docker compose logs -f

# Health check
curl http://localhost:8000/health

# Banco de dados
docker compose exec postgres psql -U orkut_user -d orkut

# Cache
docker compose exec keydb keydb-cli
```

---

## 🔧 Comandos Úteis

```bash
# Parar tudo
docker compose down

# Rebuild
docker compose up -d --build

# Ver logs de um serviço
docker compose logs -f backend

# Executar comando no backend
docker compose exec backend python -m pytest

# Backup banco de dados
docker compose exec postgres pg_dump -U orkut_user orkut > backup.sql

# Restaurar banco de dados
docker compose exec -T postgres psql -U orkut_user orkut < backup.sql
```

---

## 🐛 Troubleshooting

**Erro de conexão com banco:**
```bash
docker compose restart postgres
docker compose logs postgres
```

**Frontend não carrega:**
```bash
docker compose restart frontend
# Verifique VITE_API_URL no .env
```

**Cache não funciona:**
```bash
docker compose restart keydb
docker compose exec keydb keydb-cli ping
```

---

## 📚 Próximos Passos

1. ✅ Aplicação rodando
2. 🔐 Configure JWT_SECRET seguro
3. 🤖 Integre Gemini API
4. 🌐 Configure domínio customizado
5. 📊 Ative monitoramento (Sentry)
6. 🔄 Configure backups automáticos
7. 🚀 Escale conforme necessário

Precisa de ajuda? Veja [DEPLOY.md](./DEPLOY.md) para guia completo.
