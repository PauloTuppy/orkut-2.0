# 🔐 Guia de Login - Orkut 2.0

## ✅ **PROBLEMA CORRIGIDO!**

### ❌ **Problema Anterior:**
- Login fazia requisição direta para `http://localhost:8000`
- Chrome bloqueava por "Private Network Access"
- Erro de CORS e segurança

### ✅ **Solução Implementada:**
- Login agora usa **proxy do Vite** (`/api`)
- Requisições passam pelo frontend primeiro
- Sem bloqueio do Chrome
- Mais seguro e correto

---

## 🚀 **Como Fazer Login**

### **Passo 1: Acesse a Aplicação**
```
http://localhost:3001
```

### **Passo 2: Use as Credenciais Demo**

#### **📧 Email:**
```
demo@orkut.com
```

#### **🔑 Senha:**
```
demo123
```

### **Passo 3: Clique em "Entrar"**
- O sistema vai autenticar
- Token será salvo no localStorage
- Redirecionamento automático para Dashboard

---

## 🎯 **Credenciais de Teste**

### **Usuário Demo:**
```
Email: demo@orkut.com
Senha: demo123
```

### **Criar Nova Conta:**
1. Clique em "Crie uma agora"
2. Preencha nome, email e senha
3. Senha deve ter mínimo 8 caracteres
4. Registro automático e login

---

## 🔍 **Verificar se Está Funcionando**

### **1. Abra DevTools (F12)**
```
Console > Network
```

### **2. Tente Fazer Login**
```
Deve ver: POST /api/auth/login
Status: 200 OK
```

### **3. Verificar Token**
```javascript
// No Console do navegador:
localStorage.getItem('access_token')
// Deve retornar: "demo-token-12345"
```

---

## 🛠️ **Troubleshooting**

### **Problema: "Email ou senha inválidos"**

#### **Solução:**
- Verifique se digitou corretamente:
  - Email: `demo@orkut.com`
  - Senha: `demo123`
- Certifique-se de que o backend está rodando

### **Problema: Erro de Rede**

#### **Verificar Backend:**
```bash
# Deve estar rodando em:
http://localhost:8000

# Testar:
curl http://localhost:8000/docs
```

#### **Verificar Frontend:**
```bash
# Deve estar rodando em:
http://localhost:3001

# Proxy configurado em vite.config.ts
```

### **Problema: Página não carrega**

#### **Solução:**
1. **Limpar cache do navegador:**
   - `Ctrl + Shift + R` (Windows/Linux)
   - `Cmd + Shift + R` (Mac)

2. **Verificar processos:**
   - Backend: porta 8000
   - Frontend: porta 3001

3. **Reiniciar aplicação:**
   ```bash
   # Parar ambos (Ctrl+C)
   # Iniciar backend
   cd backend
   uvicorn app.main:app --reload
   
   # Iniciar frontend (novo terminal)
   cd frontend
   npm run dev
   ```

---

## 📊 **Fluxo de Autenticação**

### **1. Usuário Envia Credenciais:**
```
Frontend (localhost:3001)
  ↓
POST /api/auth/login
  ↓
Proxy Vite
  ↓
Backend (localhost:8000)
```

### **2. Backend Valida:**
```python
if email == "demo@orkut.com" and password == "demo123":
    return {"access_token": "demo-token-12345"}
```

### **3. Frontend Salva Token:**
```javascript
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('user_email', email);
```

### **4. Redirecionamento:**
```javascript
navigate('/') // Dashboard
```

---

## 🎨 **Interface de Login**

### **Elementos Visuais:**
- **Logo Orkut**: Animado com gradiente
- **Personagens MSN**: Flutuantes com status
- **Glassmorphism**: Card transparente moderno
- **Animações**: Framer Motion suaves
- **Bolhas Nostálgicas**: Comunidades, Status, Feed

### **Campos do Formulário:**
- **Email**: Com ícone de envelope
- **Senha**: Com toggle de visibilidade
- **Dicas**: Credenciais demo visíveis
- **Botão**: Gradiente Orkut com loading

---

## 🔐 **Segurança**

### **Token JWT:**
```
access_token: "demo-token-12345"
token_type: "bearer"
```

### **Armazenamento:**
```javascript
// LocalStorage
localStorage.setItem('access_token', token);
localStorage.setItem('user_email', email);
localStorage.setItem('user_name', name);
```

### **Proteção de Rotas:**
```typescript
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}
```

---

## 🎯 **Após o Login**

### **Você Terá Acesso a:**
- ✅ Dashboard com posts sociais
- ✅ Comunidades (criar e participar)
- ✅ Chat MSN com IA
- ✅ P2P Share (upload de arquivos)
- ✅ RSS Feed (notícias reais)
- ✅ Gist Memory (análise de PDFs)
- ✅ Perfil do Vinicius Junior
- ✅ Audio Rooms
- ✅ Voice Chat

---

## 💡 **Dicas**

### **Desenvolvimento:**
- Token demo nunca expira
- Não precisa de banco de dados
- Registro sempre funciona
- Logout limpa localStorage

### **Produção:**
- Implementar JWT real
- Validação de email
- Hash de senha (bcrypt)
- Refresh tokens
- Rate limiting

---

## 🚀 **Comandos Rápidos**

### **Iniciar Aplicação:**
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **Testar Login:**
```bash
# Via curl
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@orkut.com","password":"demo123"}'
```

### **Limpar Sessão:**
```javascript
// No Console do navegador
localStorage.clear();
location.reload();
```

---

## 🎊 **Status Final**

### ✅ **Login Funcionando:**
- Proxy Vite configurado
- Requisições seguras
- Token salvo corretamente
- Redirecionamento automático
- Sem erros de CORS
- Sem bloqueio do Chrome

### 🚀 **Pronto para Usar:**
- Credenciais demo funcionando
- Registro funcionando
- Proteção de rotas ativa
- Interface linda e nostálgica

---

**🔐 LOGIN CORRIGIDO E FUNCIONANDO 100%!**

**Acesse: http://localhost:3001**

**Use: demo@orkut.com / demo123**

**ENTRE E APROVEITE O ORKUT 2.0! 💜✨**
