# 🔧 Correção Rápida de Erros - Orkut 2.0

## ❌ **Erros Identificados no Console**

### **1. AxiosError - Backend não está rodando**
```
GistMemory.tsx:247 Erro ao processar PDF: AxiosError
P2PShare.tsx:106 Erro ao carregar arquivos: AxiosError
P2PShare.tsx:117 Erro ao carregar estatísticas: AxiosError
```

### **2. Erros de Cache do Navegador**
```
CommunityGrid is not defined
showChat is not defined
```

---

## ✅ **SOLUÇÃO RÁPIDA**

### **Passo 1: Iniciar o Backend**

#### **Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

#### **Verificar se está rodando:**
```
Abra: http://localhost:8000/docs
```

### **Passo 2: Limpar Cache do Navegador**

#### **Opção A - Hard Refresh:**
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

#### **Opção B - Limpar Cache Completo:**
1. Abra DevTools (`F12`)
2. Clique com botão direito no ícone de refresh
3. Selecione "Empty Cache and Hard Reload"

#### **Opção C - Reiniciar Frontend:**
```bash
# No terminal do frontend
Ctrl + C  # Parar o servidor

# Limpar cache do Vite
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

### **Passo 3: Verificar Portas**

#### **Backend deve estar em:**
```
http://localhost:8000
```

#### **Frontend deve estar em:**
```
http://localhost:3000
```

---

## 🚀 **COMANDOS COMPLETOS**

### **Setup Completo (Primeira Vez):**

#### **Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### **Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### **Uso Diário (Já Instalado):**

#### **Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

#### **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔍 **Diagnóstico de Problemas**

### **Problema: Backend não inicia**

#### **Erro: "ModuleNotFoundError"**
```bash
# Solução: Instalar dependências
cd backend
pip install -r requirements.txt
```

#### **Erro: "Port 8000 already in use"**
```bash
# Solução: Matar processo na porta 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### **Problema: Frontend não conecta ao Backend**

#### **Verificar Proxy no vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

#### **Verificar CORS no Backend:**
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Problema: Erros de Cache**

#### **Solução 1: Hard Refresh**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

#### **Solução 2: Limpar Cache do Vite**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

#### **Solução 3: Limpar Cache do Navegador**
```
1. F12 (DevTools)
2. Application > Storage > Clear site data
3. Refresh
```

---

## 📊 **Checklist de Verificação**

### **Backend:**
- [ ] Backend instalado (`pip install -r requirements.txt`)
- [ ] Backend rodando (`uvicorn app.main:app --reload`)
- [ ] Porta 8000 disponível
- [ ] Docs acessível (`http://localhost:8000/docs`)
- [ ] PyPDF2 instalado (`pip install PyPDF2 pdfplumber`)

### **Frontend:**
- [ ] Frontend instalado (`npm install`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Porta 3000 disponível
- [ ] Conectando ao backend
- [ ] Cache limpo

### **Navegador:**
- [ ] Cache limpo (Hard Refresh)
- [ ] DevTools sem erros críticos
- [ ] Console sem AxiosError
- [ ] Páginas carregando corretamente

---

## 🎯 **Teste Rápido**

### **1. Verificar Backend:**
```bash
curl http://localhost:8000/docs
```

**Esperado:** Página do Swagger UI

### **2. Verificar Frontend:**
```bash
curl http://localhost:3000
```

**Esperado:** HTML da aplicação

### **3. Verificar Conexão:**
```bash
# No navegador, abra DevTools (F12)
# Vá para Network
# Recarregue a página
# Verifique se há chamadas para /api/*
```

**Esperado:** Chamadas com status 200 ou 404 (não AxiosError)

---

## 💡 **Dicas Importantes**

### **Sempre que reiniciar o computador:**
1. Iniciar Backend primeiro
2. Depois iniciar Frontend
3. Aguardar ambos estarem prontos

### **Se algo não funcionar:**
1. Parar ambos os servidores (Ctrl+C)
2. Limpar cache do Vite
3. Reiniciar Backend
4. Reiniciar Frontend
5. Hard Refresh no navegador

### **Para desenvolvimento:**
- Mantenha 2 terminais abertos
- Terminal 1: Backend
- Terminal 2: Frontend
- Não feche os terminais durante o desenvolvimento

---

## 🚀 **Script de Inicialização Rápida**

### **Windows (PowerShell):**
```powershell
# Salve como start-orkut.ps1

# Terminal 1 - Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn app.main:app --reload"

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Terminal 2 - Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Aguardar 5 segundos
Start-Sleep -Seconds 5

# Abrir navegador
Start-Process "http://localhost:3000"
```

### **Linux/Mac (Bash):**
```bash
#!/bin/bash
# Salve como start-orkut.sh

# Terminal 1 - Backend
gnome-terminal -- bash -c "cd backend && uvicorn app.main:app --reload; exec bash"

# Aguardar 3 segundos
sleep 3

# Terminal 2 - Frontend
gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash"

# Aguardar 5 segundos
sleep 5

# Abrir navegador
xdg-open http://localhost:3000
```

---

## 🎊 **Status Esperado**

### **Backend Rodando:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### **Frontend Rodando:**
```
VITE v5.0.0  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### **Navegador:**
```
✅ Página carrega sem erros
✅ Login funciona
✅ Dashboard aparece
✅ Sem AxiosError no console
✅ Funcionalidades operacionais
```

---

**🔧 SIGA ESTES PASSOS E TUDO FUNCIONARÁ!**

**A causa principal dos erros é o backend não estar rodando. Inicie-o primeiro! 🚀**

**ORKUT 2.0 PRONTO PARA USO! 💜✨**
