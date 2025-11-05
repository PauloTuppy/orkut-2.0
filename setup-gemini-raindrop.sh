#!/bin/bash
# Setup Completo: Gemini CLI + Raindrop MCP para Orkut 2.0
# Uso: chmod +x setup-gemini-raindrop.sh && ./setup-gemini-raindrop.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   ORKUT 2.0: Gemini CLI + Raindrop MCP Setup                   ║"
echo "║   Automação Inteligente de Desenvolvimento End-to-End          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# ============================================================================
# PARTE 1: Verificar Pré-requisitos
# ============================================================================
echo -e "${YELLOW}[STEP 1/5] Verificando Pré-requisitos...${NC}"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado${NC}"
    echo "   Instale Python 3.11+: https://python.org/downloads"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | awk '{print $2}')
echo -e "${GREEN}✅ Python ${PYTHON_VERSION}${NC}"

# Verificar Google Cloud CLI
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI não encontrado${NC}"
    echo "   Instale: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo -e "${GREEN}✅ Google Cloud CLI${NC}"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado${NC}"
    echo "   Instale Git: https://git-scm.com/downloads"
    exit 1
fi
echo -e "${GREEN}✅ Git${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "   Instale Node.js 20+: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"

echo ""

# ============================================================================
# PARTE 2: Setup Google Cloud (GCP)
# ============================================================================
echo -e "${YELLOW}[STEP 2/5] Configurando Google Cloud Project...${NC}"
echo ""

# Verificar se já tem projeto
GCP_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$GCP_PROJECT" ]; then
    echo -e "${BLUE}Nenhum projeto GCP selecionado${NC}"
    echo "Qual é seu GCP Project ID? (ex: orkut-2.0-prod)"
    read -p "Project ID: " GCP_PROJECT
    gcloud config set project $GCP_PROJECT
else
    echo -e "${GREEN}✅ Projeto GCP: ${GCP_PROJECT}${NC}"
fi

# Habilitar APIs necessárias
echo -e "${BLUE}Habilitando APIs do Google Cloud...${NC}"

gcloud services enable \
    cloudsql.googleapis.com \
    redis.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    iam.googleapis.com \
    --project=$GCP_PROJECT

echo -e "${GREEN}✅ APIs habilitadas${NC}"
echo ""

# ============================================================================
# PARTE 3: Instalar Gemini CLI + Raindrop MCP
# ============================================================================
echo -e "${YELLOW}[STEP 3/5] Instalando Gemini CLI + Raindrop MCP...${NC}"
echo ""

# Criar venv
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Criando Python Virtual Environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate

echo -e "${BLUE}Atualizando pip...${NC}"
pip install --upgrade pip setuptools wheel

echo -e "${BLUE}Instalando Gemini CLI...${NC}"
pip install google-ai-sdk gemini-cli

echo -e "${BLUE}Instalando Raindrop MCP...${NC}"
pip install raindrop-mcp

echo -e "${BLUE}Instalando dependências auxiliares...${NC}"
pip install \
    python-dotenv \
    pydantic \
    sqlalchemy \
    psycopg2-binary \
    redis \
    aioredis \
    fastapi \
    uvicorn

echo -e "${GREEN}✅ Gemini CLI + Raindrop MCP instalados${NC}"
echo ""

# ============================================================================
# PARTE 4: Autenticar com Gemini + Google Cloud
# ============================================================================
echo -e "${YELLOW}[STEP 4/5] Autenticando Gemini CLI + Google Cloud...${NC}"
echo ""

echo -e "${BLUE}Autenticando com Google Cloud...${NC}"
gcloud auth application-default login

echo -e "${BLUE}Configurando Gemini CLI...${NC}"
gemini-cli login

echo -e "${BLUE}Configurando Raindrop MCP...${NC}"
raindrop-mcp configure \
    --gcp-project=$GCP_PROJECT \
    --gcp-region=us-central1 \
    --auth-method=gcloud

echo -e "${GREEN}✅ Autenticações configuradas${NC}"
echo ""

# ============================================================================
# PARTE 5: Inicializar Orkut 2.0 com Novo Stack
# ============================================================================
echo -e "${YELLOW}[STEP 5/5] Inicializando Orkut 2.0 com Gemini CLI + Raindrop MCP...${NC}"
echo ""

# Criar diretório do projeto
if [ ! -d "orkut-2.0" ]; then
    echo -e "${BLUE}Criando diretório do projeto...${NC}"
    mkdir -p orkut-2.0
    cd orkut-2.0
else
    cd orkut-2.0
fi

# Inicializar git
if [ ! -d ".git" ]; then
    git init
    git config user.name "Developer"
    git config user.email "dev@orkut.local"
fi

echo -e "${BLUE}Inicializando projeto com Gemini CLI + Raindrop MCP...${NC}"

# Criar arquivo de configuração
cat > .orkut-config.yml << 'ORKUT_CONFIG'
project:
  name: orkut-2.0
  description: The Platform Meta Should Have Built
  version: 0.1.0
  author: Your Name

gemini:
  model: gemini-pro
  temperature: 0.7
  max_tokens: 4096

raindrop_mcp:
  enabled: true
  gcp_project: GCP_PROJECT_PLACEHOLDER
  gcp_region: us-central1
  services:
    - cloud_sql
    - redis
    - cloud_run
    - secret_manager

smart_features:
  smart_memory: enabled
  smart_sql: enabled
  smart_buckets: enabled
  pii_detection: enabled
  compliance:
    lgpd: enabled
    gdpr: disabled

database:
  engine: postgresql
  host: cloudsql
  port: 5432
  name: orkut

cache:
  engine: redis
  host: memorystore
  port: 6379

deployment:
  platform: google_cloud_run
  region: us-central1
  container_registry: gcr.io

monitoring:
  sentry: enabled
  cloud_logging: enabled
  cloud_monitoring: enabled
ORKUT_CONFIG

# Substituir placeholder
sed -i "s/GCP_PROJECT_PLACEHOLDER/$GCP_PROJECT/g" .orkut-config.yml

echo -e "${GREEN}✅ Configuração criada${NC}"

# Criar arquivo de sessão
cat > .session.json << 'SESSION_JSON'
{
  "session_id": "sess_orkut_001",
  "timeline_id": "v1_communities_chat",
  "created_at": "2025-11-04T23:00:00Z",
  "project": "orkut-2.0",
  "status": "initialized",
  "smart_memory": {
    "working_memory": "session_active",
    "episodic_memory": "ready",
    "semantic_memory": "ready",
    "procedural_memory": "ready"
  },
  "stages": {
    "requirements_analysis": "pending",
    "architecture_design": "pending",
    "database_schema": "pending",
    "code_generation": "pending",
    "testing": "pending",
    "provisioning": "pending",
    "deployment": "pending",
    "monitoring": "pending"
  }
}
SESSION_JSON

echo -e "${GREEN}✅ Sessão criada${NC}"

# Criar arquivos de estrutura básica
mkdir -p .raindrop-mcp .gemini-cache

cat > .raindrop-mcp/workflows.yml << 'WORKFLOWS'
workflows:
  complete_app_build:
    name: Complete Application Build
    description: Full workflow from requirements to deployment
    stages:
      - name: requirements_analysis
        duration: 30m
        tools: [gemini, smart_memory]
      - name: architecture_design
        duration: 45m
        tools: [gemini, raindrop_mcp]
      - name: database_schema
        duration: 30m
        tools: [smart_sql, smart_memory]
      - name: code_generation
        duration: 60m
        tools: [gemini, smart_buckets]
      - name: testing
        duration: 45m
        tools: [pytest, vitest, raindrop_mcp]
      - name: provisioning
        duration: 60m
        tools: [raindrop_mcp, gcp]
      - name: deployment
        duration: 45m
        tools: [raindrop_mcp, cloud_run]
      - name: monitoring
        duration: 30m
        tools: [sentry, cloud_logging]
    total_duration: 285m  # ~5 hours automated
WORKFLOWS

echo -e "${GREEN}✅ Workflows criados${NC}"

# Criar arquivo README
cat > README.md << 'README'
# Orkut 2.0: Developed with Gemini CLI + Raindrop MCP

> The Platform Meta Should Have Built

## Quick Start

### Prerequisites
- Python 3.11+
- Google Cloud Account
- Node.js 20+

### Installation

```bash
# Activate venv
source venv/bin/activate

# Initialize with Gemini CLI
gemini-cli init orkut-2.0

# Start development with Raindrop MCP
raindrop-mcp orchestrate --workflow complete_app_build
```

### Project Structure

```
orkut-2.0/
├─ .orkut-config.yml        # Project configuration
├─ .session.json             # Session state (SmartMemory)
├─ .raindrop-mcp/
│  ├─ workflows.yml
│  ├─ schemas/
│  └─ templates/
├─ .gemini-cache/            # Gemini context cache
├─ backend/                  # FastAPI application
├─ frontend/                 # React application
├─ database/                 # SmartSQL schemas
└─ infrastructure/           # Raindrop MCP configs
```

## Architecture

### 5 Pillars
1. **Orkut Communities** - Discover & belong
2. **MSN Messenger** - Real-time 1-on-1 chat
3. **RSS Reader** - Curated content with AI
4. **Clubhouse Rooms** - Audio discussions
5. **Napster P2P** - Creator economy

### Smart Features
- **SmartMemory**: Session persistence (episodic, semantic, procedural)
- **SmartSQL**: Intelligent database automation + PII detection
- **SmartBuckets**: AI-decomposed file storage
- **Gemini CLI**: Conversational development
- **Raindrop MCP**: Infrastructure orchestration

## Development Workflow

### Initialize Session
```bash
gemini-cli session start "Build Orkut communities with chat"
```

### Raindrop MCP Guidance
```
Gemini: "I'll help you build Orkut 2.0. Let me clarify your requirements..."

[Interactive questions about users, features, compliance]

Raindrop MCP: "Based on your requirements, I'll orchestrate the build..."
[Automatic: architecture → schema → code → test → deploy]
```

### Session Persistence
```bash
# Reconnect to existing session
gemini-cli session attach sess_orkut_001

# Create new timeline from existing session
gemini-cli timeline create v2_add_audio --from sess_orkut_001
```

## Deployment

### Staging
```bash
git push origin develop
# Raindrop MCP automatically deploys to staging
```

### Production
```bash
git tag v1.0.0
git push origin v1.0.0
# Raindrop MCP orchestrates production deployment
```

## Monitoring & Compliance

- **PII Detection**: Automatic via SmartSQL
- **LGPD Compliance**: Built-in (data retention policies)
- **Error Tracking**: Sentry integration
- **Infrastructure**: Cloud Logging + Cloud Monitoring

## Resources

- [Gemini CLI Docs](https://ai.google.dev/docs)
- [Raindrop MCP Docs](https://docs.liquidmetal.ai)
- [SmartMemory Reference](https://docs.liquidmetal.ai/concepts/smartmemory/)
- [SmartSQL Reference](https://docs.liquidmetal.ai/concepts/smartsql/)

## License

MIT

---

**Built with Gemini CLI + Raindrop MCP**
README

echo -e "${GREEN}✅ README criado${NC}"

# Commit inicial
git add -A
git commit -m "chore: Initialize Orkut 2.0 with Gemini CLI + Raindrop MCP stack"

echo ""
echo -e "${GREEN}✅ Projeto inicializado${NC}"

# ============================================================================
# FINALIZAÇÃO
# ============================================================================
echo ""
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║            🚀 SETUP COMPLETO!                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo -e "${GREEN}Próximos Passos:${NC}"
echo ""
echo "1. Iniciar sessão Gemini CLI:"
echo -e "   ${YELLOW}gemini-cli session start \"Build complete Orkut app\"${NC}"
echo ""
echo "2. Deixar Raindrop MCP orquestrar:"
echo -e "   ${YELLOW}raindrop-mcp orchestrate --session sess_orkut_001 --workflow complete_app_build${NC}"
echo ""
echo "3. Acompanhar progresso (8 stages automáticos):"
echo -e "   ${YELLOW}raindrop-mcp logs --session sess_orkut_001 --follow${NC}"
echo ""
echo "4. Verificar status:"
echo -e "   ${YELLOW}cat .session.json${NC}"
echo ""

echo -e "${BLUE}Informações do Projeto:${NC}"
echo "  Project ID: $GCP_PROJECT"
echo "  Region: us-central1"
echo "  Session: sess_orkut_001"
echo "  Timeline: v1_communities_chat"
echo ""

echo -e "${BLUE}Recursos Criados:${NC}"
echo "  ✅ Gemini CLI instalado"
echo "  ✅ Raindrop MCP configurado"
echo "  ✅ SmartMemory inicializado"
echo "  ✅ Google Cloud APIs habilitadas"
echo "  ✅ Projeto estruturado"
echo ""

echo -e "${GREEN}Você está pronto para desenvolvimento inteligente!${NC}"
echo ""

cd ..
echo -e "${YELLOW}Diretório: $(pwd)/orkut-2.0${NC}"
echo ""
