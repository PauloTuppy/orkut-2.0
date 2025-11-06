# 🚀 AI Features - Guia Rápido

## Teste Rápido dos Endpoints

```powershell
# Execute o script de teste
.\test-ai-endpoints.ps1
```

---

## 🎯 Funcionalidades Implementadas

### 1. 🧠 Gist Memory
**O que faz:** Resume documentos longos em múltiplas páginas

**Como usar:**
1. Acesse: `http://localhost:3000/gist-memory`
2. Digite um título
3. Cole um texto longo (artigo, relatório, etc)
4. Clique em "Gerar Resumos"
5. Veja os resumos por página
6. Faça perguntas sobre o documento

**Exemplo de teste:**
```
Título: "História da Programação"
Conteúdo: [Cole um artigo longo sobre programação]
```

---

### 2. 🎤 Voice Chat
**O que faz:** Converte texto em voz e voz em texto

**Text-to-Speech:**
1. Acesse: `http://localhost:3000/voice-chat`
2. Selecione uma voz (Ink Whisper, Professional)
3. Digite um texto
4. Clique em "Ouvir"
5. Ouça o áudio gerado

**Speech-to-Text:**
1. Clique em "Começar a Gravar"
2. Permita acesso ao microfone
3. Fale algo
4. Clique em "Parar Gravação"
5. Veja a transcrição

---

### 3. 🎧 LiveKit Rooms
**O que faz:** Cria salas de voz em tempo real

**Como usar:**
1. Acesse: `http://localhost:3000/livekit-rooms`
2. Digite nome da sala (ex: "Desenvolvimento")
3. Clique em "Criar"
4. Veja a sala na lista
5. Clique em "Entrar"
6. Receba token de acesso

---

## 🔧 Comandos Úteis

### Backend
```powershell
# Iniciar backend
cd backend
uvicorn app.main:app --reload --port 8000

# Testar health
curl http://localhost:8000/health

# Ver logs
# Os logs aparecem no terminal do uvicorn
```

### Frontend
```powershell
# Iniciar frontend
cd frontend
npm run dev

# Acesse: http://localhost:3000
```

---

## 📡 Endpoints Disponíveis

### Gist Memory
```
POST /api/ai/gist-memory
Body: { "content": "...", "title": "..." }

POST /api/ai/ask-question
Body: { "question": "...", "context": "..." }
```

### Voice
```
POST /api/ai/text-to-speech?text=Olá
GET  /api/ai/voices
POST /api/ai/speech-to-text (multipart/form-data)
```

### LiveKit
```
GET  /api/ai/rooms
POST /api/ai/rooms?room_name=Sala1
POST /api/ai/token?room_name=Sala1&user_name=User1
```

---

## 🎨 Interface

### Menu AI no Header
Clique em "AI" no header para ver:
- 🧠 Gist Memory
- 🎤 Voice Chat
- 📹 LiveKit Rooms

### Design
- **Gist Memory**: Gradiente roxo/rosa
- **Voice Chat**: Gradiente azul/ciano
- **LiveKit Rooms**: Gradiente verde/teal

---

## ✅ Checklist de Teste

- [ ] Backend rodando em `http://localhost:8000`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Login funcionando
- [ ] Menu "AI" visível no header
- [ ] Gist Memory: Resumir documento
- [ ] Gist Memory: Fazer pergunta
- [ ] Voice Chat: TTS funcionando
- [ ] Voice Chat: STT com microfone
- [ ] LiveKit: Criar sala
- [ ] LiveKit: Listar salas
- [ ] LiveKit: Entrar em sala

---

## 🐛 Problemas Comuns

### "Network Error"
```powershell
# Verifique se o backend está rodando
curl http://localhost:8000/health

# Verifique CORS no backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### "Microfone não autorizado"
- Chrome: `chrome://settings/content/microphone`
- Firefox: `about:preferences#privacy`
- Permita acesso ao microfone para localhost

### "API Key inválida"
```bash
# Verifique backend/.env
CEREBRAS_API_KEY=csk-...
CARTESIA_API_KEY=sk_car_...
LIVEKIT_API_KEY=devkey
```

---

## 📊 Arquitetura

```
Frontend (React)
    ↓
aiService.ts (API Client)
    ↓
Backend (FastAPI)
    ↓
Services:
  - cerebras_service.py (LLM)
  - cartesia_service.py (Voice)
  - livekit_service.py (Rooms)
    ↓
External APIs:
  - Cerebras (Gist Memory)
  - Cartesia (TTS/STT)
  - LiveKit (Voice Rooms)
```

---

## 🚀 Próximos Passos

1. **Testar todas as funcionalidades**
2. **Adicionar mais vozes**
3. **Implementar chat de voz nas rooms**
4. **Adicionar histórico de resumos**
5. **Deploy em produção**

---

**Tudo pronto! Comece testando com:**
```powershell
.\test-ai-endpoints.ps1
```
