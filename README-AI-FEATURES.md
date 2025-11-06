# 🤖 Orkut 2.0 - AI Features

## 🎯 Visão Geral

Integração completa de 3 funcionalidades de IA no Orkut 2.0:
- 🧠 **Gist Memory** - Resumos inteligentes de documentos
- 🎤 **Voice Chat** - Conversão texto ↔ voz
- 🎧 **LiveKit Rooms** - Salas de voz em tempo real

---

## ✨ Funcionalidades

### 1. 🧠 Gist Memory
Resume documentos longos usando IA (Cerebras LLM)

**Recursos:**
- Divide documento em páginas
- Gera resumo para cada página
- Sistema de perguntas e respostas
- Interface moderna com gradiente roxo/rosa

**Acesse:** `/gist-memory`

---

### 2. 🎤 Voice Chat
Converte texto em voz e voz em texto (Cartesia)

**Recursos:**
- Text-to-Speech com múltiplas vozes
- Speech-to-Text com gravação
- Player de áudio integrado
- Interface com gradiente azul/ciano

**Acesse:** `/voice-chat`

---

### 3. 🎧 LiveKit Rooms
Cria salas de voz em tempo real (LiveKit)

**Recursos:**
- Criar salas personalizadas
- Listar salas ativas
- Entrar com token de acesso
- Interface com gradiente verde/teal

**Acesse:** `/livekit-rooms`

---

## 🚀 Como Usar

### 1. Iniciar Backend
```powershell
cd backend
uvicorn app.main:app --reload
```

### 2. Iniciar Frontend
```powershell
cd frontend
npm run dev
```

### 3. Acessar
```
http://localhost:3000
→ Login
→ Menu "AI" no header
→ Escolha uma funcionalidade
```

---

## 🧪 Testar

### Script Automatizado
```powershell
.\test-ai-endpoints.ps1
```

### Resultado Esperado
```
✅ Health Check
⚠️  Gist Memory (precisa API key válida)
✅ Voices
✅ Text-to-Speech
✅ List Rooms
✅ Create Room
✅ Create Token
```

---

## 📡 Endpoints

### Gist Memory
```
POST /api/ai/gist-memory
POST /api/ai/ask-question
```

### Voice
```
POST /api/ai/text-to-speech
POST /api/ai/speech-to-text
GET  /api/ai/voices
```

### LiveKit
```
GET  /api/ai/rooms
POST /api/ai/rooms
POST /api/ai/token
```

---

## 🎨 Design

### Menu AI
Clique em "AI" no header para ver:
- 🧠 Gist Memory
- 🎤 Voice Chat
- 📹 LiveKit Rooms

### Cores
- **Gist Memory**: Roxo → Rosa
- **Voice Chat**: Azul → Ciano
- **LiveKit Rooms**: Verde → Teal

---

## 📊 Status

| Componente | Status | Observação |
|------------|--------|------------|
| Frontend | ✅ 100% | 3 componentes criados |
| Backend | ✅ 85% | 6/7 endpoints funcionando |
| Gist Memory | ⚠️ 85% | Precisa API key válida |
| Voice Chat | ✅ 100% | Placeholder funcionando |
| LiveKit Rooms | ✅ 100% | Mock funcionando |

---

## 🔧 Configuração

### Backend (.env)
```bash
# APIs
CEREBRAS_API_KEY=csk-...
CARTESIA_API_KEY=sk_car_...
LIVEKIT_API_KEY=devkey

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 📚 Documentação

- `FRONTEND-AI-INTEGRATION.md` - Guia completo
- `AI-FEATURES-QUICKSTART.md` - Guia rápido
- `AI-USAGE-EXAMPLES.md` - Exemplos práticos
- `INTEGRATION-STATUS.md` - Status atual
- `QUICK-COMMANDS.md` - Comandos úteis

---

## 🎯 Exemplos de Uso

### Gist Memory
```
1. Acesse /gist-memory
2. Digite título: "Relatório Q4"
3. Cole texto longo
4. Clique "Gerar Resumos"
5. Veja resumos por página
6. Faça perguntas sobre o documento
```

### Voice Chat
```
1. Acesse /voice-chat
2. Selecione voz
3. Digite texto
4. Clique "Ouvir"
5. Ou grave sua voz
6. Veja transcrição
```

### LiveKit Rooms
```
1. Acesse /livekit-rooms
2. Digite nome da sala
3. Clique "Criar"
4. Veja sala na lista
5. Clique "Entrar"
6. Receba token de acesso
```

---

## 🐛 Troubleshooting

### "Network Error"
```powershell
# Verifique se backend está rodando
curl http://localhost:8000/health
```

### "Microfone não autorizado"
```
Chrome: chrome://settings/content/microphone
Firefox: about:preferences#privacy
```

### "API Key inválida"
```bash
# Verifique backend/.env
CEREBRAS_API_KEY=csk-...
CARTESIA_API_KEY=sk_car_...
```

---

## 🚀 Próximos Passos

1. ✅ Testar todas as funcionalidades
2. ⏳ Corrigir erro 500 no Gist Memory
3. ⏳ Implementar Cartesia real
4. ⏳ Implementar LiveKit real
5. ⏳ Deploy em produção

---

## 📈 Arquitetura

```
Frontend (React)
    ↓
aiService.ts
    ↓
Backend (FastAPI)
    ↓
Services (Cerebras, Cartesia, LiveKit)
    ↓
External APIs
```

---

## ✅ Checklist

- [x] Frontend criado
- [x] Backend criado
- [x] Rotas configuradas
- [x] Menu AI adicionado
- [x] Design system implementado
- [x] Documentação completa
- [x] Script de teste criado
- [ ] Gist Memory 100% funcional
- [ ] Cartesia integrado
- [ ] LiveKit integrado
- [ ] Deploy em produção

---

**🎉 Tudo pronto para testar!**

Execute: `.\test-ai-endpoints.ps1`

Depois acesse: `http://localhost:3000`
