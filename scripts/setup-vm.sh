#!/bin/bash

echo "🚀 Setup Orkut 2.0 em VM Ubuntu"
echo "==============================="

# Atualiza sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instala Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instala Docker Compose
echo "🐳 Instalando Docker Compose..."
sudo apt install docker-compose-plugin -y

# Instala Nginx
echo "🌐 Instalando Nginx..."
sudo apt install nginx certbot python3-certbot-nginx -y

# Cria diretório do projeto
echo "📁 Configurando projeto..."
mkdir -p ~/orkut-2.0
cd ~/orkut-2.0

# Clona repositório (ajuste a URL)
echo "📥 Clonando repositório..."
git clone https://github.com/seu-usuario/orkut-2.0.git .

# Configura variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
cp .env.example .env
echo "Por favor, edite o arquivo .env com suas configurações:"
echo "nano .env"
read -p "Pressione Enter após editar o .env..."

# Gera secrets
echo "🔐 Gerando secrets..."
JWT_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" .env
sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" .env

# Inicia aplicação
echo "🚀 Iniciando aplicação..."
docker compose -f docker-compose.prod.yml up -d

# Aguarda serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Executa migrations
echo "🗄️ Executando migrations..."
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Configura Nginx
echo "🌐 Configurando Nginx..."
read -p "Digite seu domínio (ex: orkut.com): " DOMAIN

sudo tee /etc/nginx/sites-available/orkut << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/orkut /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configura SSL
echo "🔒 Configurando SSL..."
sudo certbot --nginx -d $DOMAIN

echo "✅ Setup concluído!"
echo "🌐 Acesse: https://$DOMAIN"
echo ""
echo "📊 Comandos úteis:"
echo "  Ver logs: docker compose -f docker-compose.prod.yml logs -f"
echo "  Parar: docker compose -f docker-compose.prod.yml down"
echo "  Reiniciar: docker compose -f docker-compose.prod.yml restart"
