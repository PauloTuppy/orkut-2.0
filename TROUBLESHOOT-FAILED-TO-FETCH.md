# 🔧 Troubleshooting: "Failed to fetch"

## ❌ Problema
Ao tentar fazer login, aparece o erro **"Failed to fetch"** no navegador.

## 🎯 Causa Principal
**O backend não está rodando!** O frontend tenta se conectar ao `http://localhost:8000` mas não encontra nada lá.

---

## ✅ Solução Rápida (3 passos)

### 1️⃣ Iniciar o Backend

**Opção A: Script automático (recomendado)**
```powershell
.\start-backend.ps1
```

**Opção B: Manual**
```powershell
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Aguarde ver estas mensagens:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     🚀 Orkut 2.0 API starting...
INFO:     ✅ CORS Origins: ['http://localhost:3000', ...]
```

### 2️⃣ Testar se Backend Está Vivo
Abra outro terminal:
```powershell
curl http://localhost:8000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "cache": "disabled",
  "database": "postgresql"
}
```

### 3️⃣ Testar Login
Agora tente fazer login novamente no navegador:
- Email: `demo@orkut.com`
- Senha: `demo123`

---

## 🔍 Diagnóstico Completo

### Verificar se Backend está rodando
```powershell
# Testar health
curl http://localhost:8000/health

# Testar CORS
curl http://localhost:8000/test-cors

# Testar login direto
curl -X POST http://localhost:8000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"demo@orkut.com\",\"password\":\"demo123\"}'
```

### Verificar porta 8000
```powershell
# Ver se algo está usando a porta 8000
netstat -ano | findstr :8000
```

Se aparecer algo, mate o processo:
```powershell
taskkill /PID <PID> /F
```

---

## 🐛 Outros Erros Comuns

### Erro: "CORS policy blocked"
**Causa:** Backend não tem o IP/porta do frontend na whitelist.

**Solução:** Verifique `backend/.env`:
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://192.168.3.13:3000
```

### Erro: "Connection refused"
**Causa:** Backend não está escutando em `0.0.0.0` (todas as interfaces).

**Solução:** Inicie com:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Erro: "Module not found"
**Causa:** Dependências não instaladas.

**Solução:**
```powershell
cd backend
pip install -r requirements.txt
```

### Erro: "Port already in use"
**Causa:** Outra aplicação está usando a porta 8000.

**Solução:**
```powershell
# Encontrar processo
netstat -ano | findstr :8000

# Matar processo
taskkill /PID <PID> /F

# Ou usar outra porta
uvicorn app.main:app --reload --port 8001
```

---

## 🌐 Testar no Navegador

### 1. Abra o DevTools (F12)
- Vá para a aba **Network**
- Tente fazer login
- Veja a requisição para `/api/auth/login`

### 2. Verifique o erro
- **Status: (failed)** → Backend não está rodando
- **Status: 0** → CORS bloqueado
- **Status: 401** → Credenciais inválidas (backend OK!)
- **Status: 500** → Erro no backend (veja logs)

### 3. Console do navegador
Procure por mensagens como:
```
❌ Login error: Failed to fetch
```

---

## 📋 Checklist Completo

- [ ] Backend está rodando? (`uvicorn app.main:app --reload`)
- [ ] Health check funciona? (`curl http://localhost:8000/health`)
- [ ] CORS configurado? (veja `backend/.env`)
- [ ] Frontend aponta para URL correta? (`http://localhost:8000`)
- [ ] Porta 8000 está livre? (`netstat -ano | findstr :8000`)
- [ ] Dependências instaladas? (`pip install -r requirements.txt`)

---

## 🚀 Iniciar Tudo de Uma Vez

### Terminal 1: Backend
```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```

### Terminal 3: Testar
```powershell
# Aguarde 5 segundos para backend iniciar
Start-Sleep -Seconds 5

# Teste health
curl http://localhost:8000/health

# Teste login
curl -X POST http://localhost:8000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"demo@orkut.com\",\"password\":\"demo123\"}'
```

---

## 🎯 Resumo

**"Failed to fetch" = Backend não está rodando**

**Solução:**
1. Abra terminal no backend
2. Execute: `uvicorn app.main:app --reload`
3. Aguarde ver "Uvicorn running on..."
4. Tente login novamente

**Pronto!** 🎉

---

## 📞 Ainda com problemas?

Envie estas informações:
1. Logs do backend (terminal onde rodou uvicorn)
2. Erro do console do navegador (F12 → Console)
3. Erro da aba Network (F12 → Network)
4. Resultado de `curl http://localhost:8000/health`
