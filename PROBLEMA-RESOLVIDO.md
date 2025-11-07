# ✅ Problema "Failed to Fetch" - RESOLVIDO

## 🎯 O que era o problema?

Quando você tentava fazer login, aparecia o erro **"Failed to fetch"** porque:

❌ **O backend não estava rodando!**

O frontend (site) tentava se conectar ao `http://localhost:8000` mas não encontrava nada lá.

---

## ✅ Solução Aplicada

### 1. Backend Iniciado
O backend agora está rodando em: **http://localhost:8000**

Você pode verificar acessando:
- Health: http://localhost:8000/health
- Docs: http://localhost:8000/docs
- CORS Test: http://localhost:8000/test-cors

### 2. Scripts Criados

Criei 3 scripts para facilitar sua vida:

#### 🔧 `start-backend.ps1`
Inicia apenas o backend
```powershell
.\start-backend.ps1
```

#### 🎨 `start-frontend.ps1`
Inicia apenas o frontend
```powershell
.\start-frontend.ps1
```

#### 🚀 `start-all.ps1`
Inicia backend + frontend automaticamente
```powershell
.\start-all.ps1
```

### 3. Guia de Troubleshooting

Criei o arquivo `TROUBLESHOOT-FAILED-TO-FETCH.md` com:
- Diagnóstico completo
- Checklist de verificação
- Soluções para erros comuns
- Comandos de teste

---

## 🎮 Como Usar Agora

### Primeira Vez (Setup)
```powershell
# 1. Instalar dependências do backend
cd backend
pip install -r requirements.txt

# 2. Instalar dependências do frontend
cd ../frontend
npm install

# 3. Voltar para raiz
cd ..
```

### Toda Vez que For Usar

**Opção 1: Tudo de uma vez (mais fácil)**
```powershell
.\start-all.ps1
```

**Opção 2: Separado (mais controle)**
```powershell
# Terminal 1: Backend
.\start-backend.ps1

# Terminal 2: Frontend
.\start-frontend.ps1
```

---

## 🧪 Testar se Está Funcionando

### 1. Testar Backend
```powershell
curl http://localhost:8000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

### 2. Testar Login
```powershell
$body = @{email='demo@orkut.com'; password='demo123'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
```

**Resposta esperada:**
```json
{
  "access_token": "demo-token-12345",
  "token_type": "bearer"
}
```

### 3. Testar no Navegador
1. Abra: http://localhost:3000 (ou http://localhost:5173)
2. Faça login com:
   - Email: `demo@orkut.com`
   - Senha: `demo123`
3. Deve funcionar! 🎉

---

## 🔍 Verificar Status

### Backend está rodando?
```powershell
# Ver processos na porta 8000
netstat -ano | findstr :8000
```

### Frontend está rodando?
```powershell
# Ver processos na porta 3000 ou 5173
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

### Ver logs do backend
Os logs aparecem no terminal onde você executou `start-backend.ps1`

Procure por:
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso
- 📍 = Informação

---

## 🐛 Problemas Comuns

### "Port already in use"
```powershell
# Encontrar processo
netstat -ano | findstr :8000

# Matar processo (substitua <PID>)
taskkill /PID <PID> /F
```

### "Module not found"
```powershell
cd backend
pip install -r requirements.txt
```

### "CORS blocked"
Verifique se o backend está rodando e se `backend/.env` tem:
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend não carrega
```powershell
cd frontend
npm install
npm run dev
```

---

## 📋 Checklist Rápido

Antes de fazer login, verifique:

- [ ] Backend rodando? (`curl http://localhost:8000/health`)
- [ ] Frontend rodando? (Abra http://localhost:3000)
- [ ] Credenciais corretas? (`demo@orkut.com` / `demo123`)
- [ ] Console do navegador sem erros? (F12 → Console)

---

## 🎯 Resumo

**Antes:**
```
Frontend → ❌ Backend não está rodando → "Failed to fetch"
```

**Agora:**
```
Frontend → ✅ Backend rodando (porta 8000) → Login funciona! 🎉
```

---

## 📞 Próximos Passos

1. ✅ Backend rodando
2. ✅ Frontend rodando
3. ✅ Login funcionando
4. 🎮 Explore as features:
   - Comunidades
   - Chat MSN
   - Feed RSS
   - Audio Rooms
   - P2P Share
   - Voice Agent

---

## 💡 Dicas

### Atalho para iniciar tudo
Crie um atalho no desktop para `start-all.ps1`:
1. Clique direito em `start-all.ps1`
2. "Criar atalho"
3. Arraste para o desktop
4. Renomeie para "🚀 Orkut 2.0"

### Ver logs em tempo real
```powershell
# Backend
Get-Content backend/logs/app.log -Wait -Tail 50

# Ou veja no terminal onde rodou start-backend.ps1
```

### Parar tudo
```powershell
# Feche as janelas do PowerShell
# Ou pressione Ctrl+C em cada terminal
```

---

## 🎉 Pronto!

Agora você pode usar o Orkut 2.0 sem problemas!

**Comandos principais:**
```powershell
# Iniciar tudo
.\start-all.ps1

# Testar backend
curl http://localhost:8000/health

# Abrir no navegador
start http://localhost:3000
```

**Credenciais demo:**
- Email: `demo@orkut.com`
- Senha: `demo123`

Divirta-se! 🎮✨
