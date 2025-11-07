# 🎵 Formatos de Áudio Suportados

**Versão:** 2.1.1  
**Data:** 07/11/2025  
**Status:** ✅ ATUALIZADO

---

## 📋 Formatos Suportados

### ✅ Formatos Aceitos

| Formato | Extensão | MIME Type | Qualidade | Uso Comum |
|---------|----------|-----------|-----------|-----------|
| **MP3** | `.mp3` | `audio/mpeg`, `audio/mp3` | Boa | Música, podcasts |
| **WAV** | `.wav` | `audio/wav`, `audio/x-wav` | Excelente | Gravações profissionais |
| **OGG** | `.ogg` | `audio/ogg` | Boa | Streaming, web |
| **M4A** | `.m4a` | `audio/mp4`, `audio/m4a`, `audio/x-m4a` | Excelente | Apple, iTunes |
| **AAC** | `.aac` | `audio/aac`, `audio/aacp` | Excelente | Streaming, mobile |

### 📏 Limites

- **Tamanho máximo:** 100 MB por arquivo
- **Duração:** Ilimitada
- **Bitrate:** Qualquer
- **Sample rate:** Qualquer
- **Canais:** Mono ou Stereo

---

## 🎯 Recomendações por Uso

### 🎙️ Podcasts
**Recomendado:** MP3 ou M4A
- **Bitrate:** 128-192 kbps
- **Sample rate:** 44.1 kHz
- **Canais:** Mono (voz) ou Stereo (música)
- **Tamanho médio:** 1-2 MB por minuto

### 🎵 Música
**Recomendado:** M4A ou MP3
- **Bitrate:** 256-320 kbps
- **Sample rate:** 44.1 kHz ou 48 kHz
- **Canais:** Stereo
- **Tamanho médio:** 2-3 MB por minuto

### 🎤 Gravações de Voz
**Recomendado:** MP3 ou OGG
- **Bitrate:** 64-128 kbps
- **Sample rate:** 22.05 kHz ou 44.1 kHz
- **Canais:** Mono
- **Tamanho médio:** 0.5-1 MB por minuto

### 🎬 Áudio de Vídeo
**Recomendado:** M4A ou AAC
- **Bitrate:** 128-256 kbps
- **Sample rate:** 48 kHz
- **Canais:** Stereo
- **Tamanho médio:** 1.5-2.5 MB por minuto

---

## 🔧 Detalhes Técnicos

### MP3 (MPEG Audio Layer 3)
```
✅ Suportado
📊 Compressão: Com perda
🎯 Compatibilidade: Universal
💾 Tamanho: Médio
🎵 Qualidade: Boa a Excelente
```

**Vantagens:**
- Compatibilidade universal
- Bom equilíbrio tamanho/qualidade
- Amplamente suportado

**Desvantagens:**
- Compressão com perda
- Não é o mais eficiente

### WAV (Waveform Audio File)
```
✅ Suportado
📊 Compressão: Sem perda
🎯 Compatibilidade: Alta
💾 Tamanho: Grande
🎵 Qualidade: Excelente
```

**Vantagens:**
- Qualidade máxima
- Sem perda de dados
- Ideal para edição

**Desvantagens:**
- Arquivos muito grandes
- Não recomendado para streaming

### OGG (Ogg Vorbis)
```
✅ Suportado
📊 Compressão: Com perda
🎯 Compatibilidade: Boa
💾 Tamanho: Pequeno
🎵 Qualidade: Boa a Excelente
```

**Vantagens:**
- Open source
- Boa compressão
- Qualidade superior ao MP3

**Desvantagens:**
- Menos compatível que MP3
- Não suportado nativamente no iOS

### M4A (MPEG-4 Audio)
```
✅ SUPORTADO (NOVO!)
📊 Compressão: Com perda (AAC)
🎯 Compatibilidade: Excelente
💾 Tamanho: Pequeno
🎵 Qualidade: Excelente
```

**Vantagens:**
- Melhor qualidade que MP3
- Menor tamanho que MP3
- Padrão Apple/iTunes
- Excelente para streaming

**Desvantagens:**
- Pode ter problemas em players antigos

### AAC (Advanced Audio Coding)
```
✅ SUPORTADO (NOVO!)
📊 Compressão: Com perda
🎯 Compatibilidade: Excelente
💾 Tamanho: Pequeno
🎵 Qualidade: Excelente
```

**Vantagens:**
- Sucessor do MP3
- Melhor qualidade/tamanho
- Padrão YouTube, Spotify
- Ideal para streaming

**Desvantagens:**
- Licenciamento proprietário

---

## 🧪 Como Testar

### Teste Rápido
```powershell
# Verificar backend
.\test-audio-simple.ps1
```

### Teste no Navegador

1. **Acesse:** http://localhost:3000/audio-rooms
2. **Entre em uma sala**
3. **Clique em "Áudios"**
4. **Teste cada formato:**
   - ✅ MP3
   - ✅ WAV
   - ✅ OGG
   - ✅ M4A (NOVO!)
   - ✅ AAC (NOVO!)

---

## 📊 Comparação de Formatos

### Tamanho de Arquivo (1 minuto de áudio)

| Formato | Bitrate | Tamanho | Qualidade |
|---------|---------|---------|-----------|
| WAV | 1411 kbps | ~10 MB | ⭐⭐⭐⭐⭐ |
| M4A | 256 kbps | ~2 MB | ⭐⭐⭐⭐⭐ |
| AAC | 256 kbps | ~2 MB | ⭐⭐⭐⭐⭐ |
| MP3 | 320 kbps | ~2.5 MB | ⭐⭐⭐⭐ |
| MP3 | 192 kbps | ~1.5 MB | ⭐⭐⭐⭐ |
| OGG | 192 kbps | ~1.5 MB | ⭐⭐⭐⭐ |
| MP3 | 128 kbps | ~1 MB | ⭐⭐⭐ |

### Compatibilidade

| Formato | Web | iOS | Android | Windows | macOS | Linux |
|---------|-----|-----|---------|---------|-------|-------|
| MP3 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WAV | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| M4A | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| AAC | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| OGG | ✅ | ❌ | ✅ | ⚠️ | ⚠️ | ✅ |

---

## 🔄 Conversão de Formatos

### Converter para M4A (Recomendado)

#### Windows (FFmpeg)
```powershell
# Instalar FFmpeg
winget install FFmpeg

# Converter MP3 para M4A
ffmpeg -i input.mp3 -c:a aac -b:a 256k output.m4a

# Converter WAV para M4A
ffmpeg -i input.wav -c:a aac -b:a 256k output.m4a
```

#### Online
- **CloudConvert:** https://cloudconvert.com/mp3-to-m4a
- **Online-Convert:** https://audio.online-convert.com/convert-to-m4a
- **FreeConvert:** https://www.freeconvert.com/mp3-to-m4a

### Converter para MP3

#### Windows (FFmpeg)
```powershell
# Converter M4A para MP3
ffmpeg -i input.m4a -c:a libmp3lame -b:a 320k output.mp3

# Converter WAV para MP3
ffmpeg -i input.wav -c:a libmp3lame -b:a 320k output.mp3
```

---

## 🐛 Troubleshooting

### Problema: M4A não é aceito

**Causa:** Navegador não reconhece o MIME type

**Solução:**
1. Verifique a extensão do arquivo (deve ser `.m4a`)
2. Tente renomear para `.mp4` (mesmo formato)
3. Converta para MP3 se necessário

### Problema: Arquivo muito grande

**Causa:** Arquivo excede 100MB

**Solução:**
```powershell
# Comprimir com FFmpeg
ffmpeg -i input.m4a -c:a aac -b:a 128k output.m4a

# Reduzir bitrate
ffmpeg -i input.m4a -c:a aac -b:a 64k output_compressed.m4a
```

### Problema: Áudio não reproduz

**Causa:** Formato corrompido ou codec não suportado

**Solução:**
1. Verifique o arquivo em outro player
2. Reconverta o arquivo
3. Use formato mais compatível (MP3)

---

## 💡 Dicas de Otimização

### Para Podcasts
```powershell
# Otimizar para voz (mono, 64kbps)
ffmpeg -i input.m4a -ac 1 -c:a aac -b:a 64k podcast.m4a
```

### Para Música
```powershell
# Alta qualidade (stereo, 256kbps)
ffmpeg -i input.wav -c:a aac -b:a 256k music.m4a
```

### Para Streaming
```powershell
# Balanceado (stereo, 128kbps)
ffmpeg -i input.mp3 -c:a aac -b:a 128k stream.m4a
```

---

## 📚 Recursos Adicionais

### Ferramentas Recomendadas

1. **FFmpeg** - Conversão de áudio
   - https://ffmpeg.org/

2. **Audacity** - Editor de áudio
   - https://www.audacityteam.org/

3. **VLC Media Player** - Player universal
   - https://www.videolan.org/

4. **MediaInfo** - Informações de arquivo
   - https://mediaarea.net/MediaInfo

### Documentação

- **MP3:** https://en.wikipedia.org/wiki/MP3
- **M4A/AAC:** https://en.wikipedia.org/wiki/Advanced_Audio_Coding
- **OGG:** https://en.wikipedia.org/wiki/Ogg
- **WAV:** https://en.wikipedia.org/wiki/WAV

---

## ✅ Checklist de Upload

Antes de fazer upload:
- [ ] Formato suportado (MP3, WAV, OGG, M4A, AAC)
- [ ] Tamanho < 100MB
- [ ] Arquivo não corrompido
- [ ] Backend rodando
- [ ] Navegador atualizado

Durante o upload:
- [ ] Barra de progresso visível
- [ ] Sem erros no console
- [ ] Conexão estável

Após o upload:
- [ ] Arquivo aparece na biblioteca
- [ ] Reprodução funciona
- [ ] Informações corretas (nome, duração, tamanho)

---

## 🎉 Resumo

**Formatos Suportados:**
- ✅ MP3 (Universal)
- ✅ WAV (Alta qualidade)
- ✅ OGG (Open source)
- ✅ M4A (Apple/iTunes) - **NOVO!**
- ✅ AAC (Streaming) - **NOVO!**

**Limite:** 100 MB por arquivo

**Recomendação:** Use M4A ou MP3 para melhor compatibilidade

**Acesse:** http://localhost:3000/audio-rooms

---

**Última atualização:** 07/11/2025  
**Versão:** 2.1.1  
**Status:** ✅ M4A E AAC SUPORTADOS!
