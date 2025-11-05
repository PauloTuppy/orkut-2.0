#!/bin/bash

echo "🚀 Deploy Orkut 2.0 para Railway"
echo "================================"

# Verifica se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Login
echo "🔐 Fazendo login no Railway..."
railway login

# Inicializa projeto (se necessário)
if [ ! -f "railway.json" ]; then
    echo "📦 Inicializando projeto Railway..."
    railway init
fi

# Adiciona serviços
echo "🗄️ Configurando banco de dados..."
railway add --database postgresql
railway add --database redis

# Configura variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
echo "Por favor, configure as seguintes variáveis no Railway Dashboard:"
echo "- JWT_SECRET"
echo "- GOOGLE_GEMINI_API_KEY"
echo "- CORS_ORIGINS"

# Deploy
echo "🚀 Fazendo deploy..."
railway up

echo "✅ Deploy concluído!"
echo "📊 Acesse o dashboard: https://railway.app/dashboard"
