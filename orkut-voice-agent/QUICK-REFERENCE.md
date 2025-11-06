# 🚀 Voice Agent Quick Reference Card

## Essential Commands

### Setup
```bash
# Install CLI
winget install LiveKit.LiveKitCLI  # Windows
brew install livekit               # macOS

# Authenticate
lk cloud auth
lk project set-default "orkut-2.0"

# Configure
cd orkut-voice-agent
cp .env.example .env
# Edit .env with your keys
```

### Deploy
```bash
# Create & deploy
lk agent create orkut-voice-agent
lk agent deploy

# Or use script
.\deploy.ps1      # Windows
./deploy.sh       # Linux/Mac
```

### Monitor
```bash
lk agent status           # Check status
lk agent logs             # View logs
lk agent logs -f          # Stream logs
lk agent metrics          # View metrics
```

### Update
```bash
# Make changes, then:
lk agent deploy           # Rolling update
lk agent rollback         # Undo last deploy
```

### Secrets
```bash
lk secret set KEY "value"  # Add secret
lk secret list             # List secrets
lk secret rotate KEY       # Rotate secret
```

---

## Required Environment Variables

```bash
# Cerebras
CEREBRAS_API_KEY=csk-...
CEREBRAS_MODEL=llama-3.3-70b

# Cartesia
CARTESIA_API_KEY=sk_car_...
CARTESIA_VOICE_ID=ink-whisper

# LiveKit
LIVEKIT_URL=wss://orkut-2-0-xxxxx.livekit.cloud
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

---

## API Endpoints

### Backend
```
POST /api/agents/token
Body: { "agentType": "sales" }
Returns: { "token": "...", "room": "...", "url": "..." }

GET /api/agents/status
Returns: { "status": "online", "agents": [...] }
```

---

## Frontend Integration

```tsx
import VoiceAgent from './components/VoiceAgent';

<VoiceAgent 
  agentType="sales"  // or "technical" or "pricing"
  onClose={() => setActiveAgent(null)}
/>
```

---

## File Structure

```
orkut-voice-agent/
├── agent.py              # Main agent
├── requirements.txt      # Dependencies
├── Dockerfile           # Container
├── .env                 # Secrets (don't commit!)
├── context/             # Knowledge bases
│   ├── sales.md
│   ├── technical.md
│   └── pricing.md
└── deploy.ps1/sh        # Deploy scripts
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Agent not starting | `lk agent logs` then `lk agent deploy` |
| API key error | `lk secret set KEY "value"` then `lk agent deploy` |
| High latency | Edit `livekit.toml`: `min_replicas = 3` then deploy |
| Connection issue | Check LIVEKIT_URL and firewall |

---

## URLs

- **Dashboard**: https://cloud.livekit.io/dashboard
- **Playground**: https://cloud.livekit.io/playground
- **Docs**: https://docs.livekit.io

---

## Agents

| Agent | Purpose | Voice |
|-------|---------|-------|
| Sales | Features & pricing | ink-whisper |
| Technical | Support & specs | Professional |
| Pricing | Plans & ROI | Consultative |

---

## Scaling

```toml
# livekit.toml
[agent]
min_replicas = 1
max_replicas = 10
target_cpu_percent = 70
```

Deploy: `lk agent deploy`

---

## Testing

**Playground:**
1. Visit https://cloud.livekit.io/playground
2. Select "orkut-voice-agent"
3. Click "Connect"
4. Start speaking!

**Local:**
```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python agent.py
```

---

## Quick Deploy Checklist

- [ ] CLI installed (`lk version`)
- [ ] Authenticated (`lk cloud auth`)
- [ ] .env configured
- [ ] Agent created (`lk agent create`)
- [ ] Deployed (`lk agent deploy`)
- [ ] Status OK (`lk agent status`)
- [ ] Tested in playground

---

**Need help?** See COMPLETE-SETUP.md for detailed guide.
