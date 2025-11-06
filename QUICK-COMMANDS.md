# ⚡ Comandos Rápidos - Orkut 2.0 AI

## 🚀 Iniciar Projeto

### Backend
```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd frontend
npm run dev
```

### Testar Endpoints
```powershell
.\test-ai-endpoints.ps1
```

---

## 🧪 Testes Manuais

### Health Check
```powershell
curl http://localhost:8000/health
```

### Gist Memory
```powershell
curl -X POST http://localhost:8000/api/ai/gist-memory `
  -H "Content-Type: application/json" `
  -d '{\"content\":\"Python e uma linguagem de programacao\",\"title\":\"Python\"}'
```

### Voices
```powershell
curl http://localhost:8000/api/ai/voices
```

### Text-to-Speech
```powershell
curl -X POST "http://localhost:8000/api/ai/text-to-speech?text=Ola"
```

### List Rooms
```powershell
curl http://localhost:8000/api/ai/rooms
```

### Create Room
```powershell
curl -X POST "http://localhost:8000/api/ai/rooms?room_name=TestRoom"
```

### Create Token
```powershell
curl -X POST "http://localhost:8000/api/ai/token?room_name=TestRoom&user_name=User1"
```

---

## 📱 URLs Frontend

- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Gist Memory: http://localhost:3000/gist-memory
- Voice Chat: http://localhost:3000/voice-chat
- LiveKit Rooms: http://localhost:3000/livekit-rooms

---

## 🔧 Troubleshooting

### Backend não inicia
```powershell
# Reinstalar dependências
cd backend
pip install -r requirements.txt

# Verificar porta
netstat -ano | findstr :8000
```

### Frontend não inicia
```powershell
# Reinstalar dependências
cd frontend
npm install

# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

### CORS Error
```bash
# Verificar backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 📊 Logs

### Ver logs do backend
```powershell
# Os logs aparecem no terminal onde o uvicorn está rodando
# Procure por:
# ✅ = Sucesso
# ❌ = Erro
# ⚠️ = Aviso
```

### Ver logs do frontend
```powershell
# Abra o DevTools do navegador (F12)
# Console → Veja erros e logs
```

---

## 🗄️ Database

### Criar migrations
```powershell
cd backend
alembic revision --autogenerate -m "mensagem"
```

### Aplicar migrations
```powershell
alembic upgrade head
```

---

## 🔑 Variáveis de Ambiente

### Backend (.env)
```bash
# Essenciais
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/orkut
JWT_SECRET=your-secret-key

# APIs (opcional para testes)
CEREBRAS_API_KEY=csk-...
CARTESIA_API_KEY=sk_car_...
LIVEKIT_API_KEY=devkey
```

---

## 📦 Instalação Rápida

### Primeira vez
```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edite .env com suas keys

# Frontend
cd frontend
npm install
```

---

## 🎯 Atalhos

### Testar tudo de uma vez
```powershell
# Terminal 1
cd backend && uvicorn app.main:app --reload

# Terminal 2
cd frontend && npm run dev

# Terminal 3
.\test-ai-endpoints.ps1
```

### Parar tudo
```powershell
# Ctrl+C em cada terminal
```

---

## 🐛 Debug

### Backend não responde
```powershell
# Verificar se está rodando
curl http://localhost:8000/health

# Verificar porta
netstat -ano | findstr :8000

# Matar processo na porta 8000
# Encontre o PID e execute:
taskkill /PID <PID> /F
```

### Frontend não carrega
```powershell
# Verificar se está rodando
curl http://localhost:3000

# Limpar cache do navegador
# Ctrl+Shift+Delete → Limpar cache
```

---

## 📈 Monitoramento

### Ver requisições em tempo real
```powershell
# Backend logs mostram todas as requisições
# Procure por:
# INFO: "GET /api/ai/rooms HTTP/1.1" 200 OK
```

### Ver performance
```powershell
# Abra DevTools (F12)
# Network → Veja tempo de cada requisição
```

---

## 🚀 Deploy

### Build frontend
```powershell
cd frontend
npm run build
```

### Testar build
```powershell
npm run preview
```

---

**Comandos mais usados:**
```powershell
# Iniciar backend
cd backend && uvicorn app.main:app --reload

# Iniciar frontend
cd frontend && npm run dev

# Testar endpoints
.\test-ai-endpoints.ps1

# Ver logs
# Olhe o terminal do backend
```
