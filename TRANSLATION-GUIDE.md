# 🌍 Guia de Tradução - Orkut 2.0

**Status:** Em Progresso  
**Idioma Alvo:** Português (Brasil)  
**Idioma Origem:** Inglês

---

## 📋 Textos Principais para Traduzir

### ✅ Já Traduzidos
- Login/Register pages
- Dashboard
- Communities
- Chat MSN
- Feed RSS
- Perfil Orkut
- Mensagens de erro principais

### 🔄 Precisam Tradução

#### Audio Rooms (AudioRooms.tsx)
```typescript
// INGLÊS → PORTUGUÊS
"Voice AI Agents" → "Agentes de IA por Voz"
"Talk to our AI agents" → "Converse com nossos agentes de IA"
"Sales Agent" → "Agente de Vendas"
"Learn about features & pricing" → "Conheça recursos e preços"
"Technical Support" → "Suporte Técnico"
"Get help with technical questions" → "Obtenha ajuda com questões técnicas"
"Pricing Specialist" → "Especialista em Preços"
"Find the best plan for you" → "Encontre o melhor plano para você"
```

#### Audio Uploader (AudioUploader.tsx)
```typescript
// Já está em português! ✅
"Gerenciar Áudios"
"Gravar Áudio"
"Upload de Arquivo"
"Biblioteca"
```

#### Dashboard (Dashboard.tsx)
```typescript
// Já está em português! ✅
"Bem-vindo ao Orkut 2.0!"
"Conecte com amigos"
```

---

## 🎯 Prioridades de Tradução

### Alta Prioridade (Visível ao Usuário)
1. ✅ Botões e labels
2. ✅ Mensagens de erro
3. ✅ Títulos de páginas
4. ✅ Placeholders de input
5. 🔄 Voice AI Agents section

### Média Prioridade
1. ✅ Tooltips
2. ✅ Mensagens de confirmação
3. 🔄 Documentação inline

### Baixa Prioridade
1. Comentários no código
2. Logs de console
3. Documentação técnica (.md files)

---

## 🔧 Como Aplicar Traduções

### Método 1: Buscar e Substituir
```bash
# Exemplo
git grep "Voice AI Agents" frontend/src
# Substituir manualmente
```

### Método 2: Arquivo de Tradução (i18n)
```typescript
// frontend/src/i18n/pt-BR.ts
export const translations = {
  audioRooms: {
    voiceAgents: "Agentes de IA por Voz",
    salesAgent: "Agente de Vendas",
    technicalSupport: "Suporte Técnico",
    // ...
  }
}
```

---

## 📝 Lista Completa de Traduções Necessárias

### Audio Rooms
| Inglês | Português |
|--------|-----------|
| Voice AI Agents | Agentes de IA por Voz |
| Talk to our AI agents powered by... | Converse com nossos agentes de IA |
| Sales Agent | Agente de Vendas |
| Learn about features & pricing | Conheça recursos e preços |
| Technical Support | Suporte Técnico |
| Get help with technical questions | Obtenha ajuda técnica |
| Pricing Specialist | Especialista em Preços |
| Find the best plan for you | Encontre o melhor plano |

### Geral
| Inglês | Português |
|--------|-----------|
| Loading... | Carregando... |
| Error | Erro |
| Success | Sucesso |
| Cancel | Cancelar |
| Save | Salvar |
| Delete | Deletar |
| Edit | Editar |
| Share | Compartilhar |
| Download | Baixar |
| Upload | Enviar |
| Record | Gravar |
| Play | Reproduzir |
| Pause | Pausar |
| Stop | Parar |

---

## ✅ Status por Componente

| Componente | Status | % Traduzido |
|------------|--------|-------------|
| Login | ✅ Completo | 100% |
| Register | ✅ Completo | 100% |
| Dashboard | ✅ Completo | 100% |
| Communities | ✅ Completo | 100% |
| Chat MSN | ✅ Completo | 100% |
| Feed RSS | ✅ Completo | 100% |
| Perfil Orkut | ✅ Completo | 100% |
| Audio Rooms | 🔄 Parcial | 80% |
| Audio Uploader | ✅ Completo | 100% |
| Gist Memory | ✅ Completo | 100% |
| P2P Share | ✅ Completo | 100% |
| Voice Agent | 🔄 Parcial | 70% |

---

## 🚀 Próximos Passos

1. **Traduzir Audio Rooms** - Voice AI Agents section
2. **Traduzir Voice Agent** - Componente de agente de voz
3. **Revisar todas as mensagens de erro**
4. **Implementar sistema i18n** (opcional, para suporte multi-idioma)

---

## 💡 Dicas

### Manter Consistência
- "Upload" → sempre "Enviar" ou "Upload"
- "Download" → sempre "Baixar" ou "Download"
- "Delete" → sempre "Deletar" ou "Excluir"

### Termos Técnicos
- Manter em inglês: API, backend, frontend, token, cache
- Traduzir: usuário, senha, email, arquivo, documento

### Tom de Voz
- Informal e amigável (estilo Orkut original)
- Usar emojis quando apropriado 😊
- Evitar jargão técnico desnecessário

---

## 📊 Progresso Geral

**Total:** 85% traduzido  
**Faltam:** ~15% (principalmente Voice AI Agents)

---

**Última atualização:** 07/11/2025  
**Responsável:** Equipe Orkut 2.0
