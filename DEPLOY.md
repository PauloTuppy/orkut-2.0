# 🚀 Guia de Deploy - Orkut 2.0

## ✅ Checklist Pré-Deploy

- [x] Backend com FastAPI + PostgreSQL + KeyDB
- [x] Frontend com React + Vite + TypeScript
- [x] Docker Compose configurado
- [x] CI/CD com GitHub Actions
- [x] Testes automatizados
- [ ] Gemini API integrada (opcional para MVP)
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (opcional)

---

## 🎯 Opções de Deploy

### 1. **Railway** (Recomendado para MVP - Mais Fácil)

**Vantagens:**
- Deploy automático via GitHub
- PostgreSQL e Redis inclusos
- SSL automático
- $5/mês de crédito grátis

**Passos:**

1. Crie conta em [railway.app](https://railway.app)

2. Instale Railway CLI:
```bash
npm install -g @railway/cli
railway login
```

3. Crie novo projeto:
```bash
railway init
```

4. Adicione PostgreSQL e Redis:
```bash
railway add --database postgresql
railway add --database redis
```

5. Configure variáveis de ambiente no Railway Dashboard:
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=seu-secret-super-seguro-aqui
GOOGLE_GEMINI_API_KEY=sua-chave-gemini
ENVIRONMENT=production
CORS_ORIGINS=https://seu-dominio.railway.app
```

6. Deploy:
```bash
railway up
```

**Custo estimado:** $5-20/mês

---

### 2. **Render.com** (Alternativa Gratuita)

**Vantagens:**
- Tier gratuito generoso
- PostgreSQL grátis (limitado)
- Redis grátis (25MB)
- SSL automático

**Passos:**

1. Crie conta em [render.com](https://render.com)

2. Crie PostgreSQL Database:
   - Dashboard → New → PostgreSQL
   - Copie a `Internal Database URL`

3. Crie Redis Instance:
   - Dashboard → New → Redis
   - Copie a `Internal Redis URL`

4. Crie Web Service para Backend:
   - Dashboard → New → Web Service
   - Conecte seu repositório GitHub
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Adicione variáveis de ambiente

5. Crie Static Site para Frontend:
   - Dashboard → New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

**Custo:** Grátis (com limitações) ou $7/mês por serviço

---

### 3. **GCP Cloud Run** (Melhor para Escala)

**Vantagens:**
- Escala automática (0 a milhões)
- Paga apenas pelo uso
- Integração com Cloud SQL e Memorystore
- Suporte nativo para Gemini API

**Passos:**

1. Instale Google Cloud CLI:
```bash
# Windows
choco install gcloudsdk

# Ou baixe de: https://cloud.google.com/sdk/docs/install
```

2. Configure projeto:
```bash
gcloud init
gcloud auth login
gcloud config set project seu-projeto-id
```

3. Crie Cloud SQL (PostgreSQL):
```bash
gcloud sql instances create orkut-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

4. Crie Memorystore (Redis):
```bash
gcloud redis instances create orkut-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0
```

5. Build e push imagens:
```bash
# Backend
gcloud builds submit --tag gcr.io/seu-projeto-id/orkut-backend ./backend

# Frontend
gcloud builds submit --tag gcr.io/seu-projeto-id/orkut-frontend ./frontend
```

6. Deploy no Cloud Run:
```bash
# Backend
gcloud run deploy orkut-backend \
  --image gcr.io/seu-projeto-id/orkut-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=postgresql://...,REDIS_URL=redis://...

# Frontend
gcloud run deploy orkut-frontend \
  --image gcr.io/seu-projeto-id/orkut-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Custo estimado:** $10-50/mês (dependendo do tráfego)

---

### 4. **Docker Compose em VM** (Controle Total)

**Vantagens:**
- Controle total
- Mais barato em longo prazo
- Ideal para aprendizado

**Passos:**

1. Crie VM (DigitalOcean, AWS EC2, GCP Compute Engine):
   - Ubuntu 22.04 LTS
   - 2GB RAM mínimo
   - 20GB disco

2. Conecte via SSH e instale Docker:
```bash
ssh root@seu-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose-plugin
```

3. Clone repositório:
```bash
git clone https://github.com/seu-usuario/orkut-2.0.git
cd orkut-2.0
```

4. Configure variáveis de ambiente:
```bash
cp .env.example .env
nano .env
```

5. Inicie aplicação:
```bash
docker compose up -d
```

6. Configure Nginx como reverse proxy:
```bash
apt install nginx certbot python3-certbot-nginx

# Configure SSL
certbot --nginx -d seu-dominio.com
```

**Custo:** $5-12/mês (VM)

---

## 🔐 Variáveis de Ambiente Essenciais

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/orkut

# Cache
REDIS_URL=redis://host:6379/0

# Security
JWT_SECRET=gere-com-openssl-rand-hex-32
CORS_ORIGINS=https://seu-frontend.com

# APIs
GOOGLE_GEMINI_API_KEY=sua-chave-aqui

# App
ENVIRONMENT=production
DEBUG=false
```

---

## 🧪 Integração Gemini API

Para adicionar funcionalidades de IA (resumos, documentos):

1. Obtenha API Key: [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Adicione ao backend (`backend/app/services/gemini.py`):
```python
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

async def summarize_text(text: str) -> str:
    response = await model.generate_content_async(
        f"Resuma este texto em 2-3 frases: {text}"
    )
    return response.text
```

3. Use nos endpoints:
```python
from app.services.gemini import summarize_text

@router.post("/posts/{post_id}/summarize")
async def summarize_post(post_id: int):
    post = await get_post(post_id)
    summary = await summarize_text(post.content)
    return {"summary": summary}
```

---

## 📊 Monitoramento

### Sentry (Erros)
```bash
pip install sentry-sdk
```

```python
import sentry_sdk
sentry_sdk.init(dsn="sua-dsn-aqui")
```

### Logs
```bash
# Ver logs no Railway
railway logs

# Ver logs no Render
render logs

# Ver logs no Cloud Run
gcloud run logs read orkut-backend

# Ver logs no Docker
docker compose logs -f
```

---

## 🎯 Recomendação para Começar

**Para MVP rápido:** Railway
- Deploy em 5 minutos
- Tudo integrado
- Fácil de escalar depois

**Para aprender:** Docker Compose em VM
- Controle total
- Entende toda stack
- Mais barato

**Para produção séria:** GCP Cloud Run
- Escala infinita
- Integração com Gemini
- Infraestrutura Google

---

## 🚀 Próximos Passos

1. Escolha plataforma de deploy
2. Configure variáveis de ambiente
3. Execute migrations: `alembic upgrade head`
4. Teste endpoints: `curl https://seu-backend.com/health`
5. Configure domínio customizado (opcional)
6. Ative monitoramento
7. Configure backups automáticos

Precisa de ajuda com alguma plataforma específica?
