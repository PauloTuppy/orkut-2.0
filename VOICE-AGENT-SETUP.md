# 🎤 Orkut 2.0 Voice Agent Setup Guide

Complete guide for deploying LiveKit + Cerebras + Cartesia voice agents.

## 📋 Prerequisites

Before starting, you need:

1. **LiveKit Cloud Account** (free tier available)
   - Sign up at: https://cloud.livekit.io
   
2. **Cerebras API Key**
   - Get at: https://cerebras.ai
   - Model: llama-3.3-70b
   
3. **Cartesia API Key**
   - Get at: https://cartesia.ai
   - For speech-to-text and text-to-speech

## 🚀 Quick Start (5 minutes)

### 1. Install LiveKit CLI

**Windows:**
```powershell
winget install LiveKit.LiveKitCLI
lk version
```

**macOS:**
```bash
brew install livekit
lk version
```

**Linux:**
```bash
curl -L https://github.com/livekit/cli/releases/latest/download/livekit-linux-amd64.tar.gz -o livekit.tar.gz
tar xzf livekit.tar.gz
sudo mv livekit /usr/local/bin/
lk version
```

### 2. Authenticate with LiveKit Cloud

```bash
# Opens browser for authentication
lk cloud auth

# List your projects
lk project list

# Set default project
lk project set-default "orkut-2.0"
```

### 3. Configure Environment

```bash
cd orkut-voice-agent

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# Required:
# - CEREBRAS_API_KEY
# - CARTESIA_API_KEY
# - LIVEKIT_URL (from LiveKit dashboard)
# - LIVEKIT_API_KEY
# - LIVEKIT_API_SECRET
```

### 4. Deploy to Cloud

**Windows:**
```powershell
.\deploy.ps1
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

Or manually:
```bash
# Create agent
lk agent create orkut-voice-agent

# Deploy
lk agent deploy

# Check status
lk agent status

# View logs
lk agent logs -f
```

## 📁 Project Structure

```
orkut-voice-agent/
├── agent.py                    # Main agent entry point
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── .env.example               # Environment template
├── .gitignore
├── deploy.ps1                 # Windows deploy script
├── deploy.sh                  # Linux/macOS deploy script
├── livekit.toml.example       # LiveKit config template
├── README.md
├── DEPLOY.md                  # Detailed deployment guide
├── QUICKSTART.md              # Quick start guide
├── context/                   # Knowledge bases
│   ├── sales.md              # Sales information
│   ├── technical.md          # Technical specs
│   └── pricing.md            # Pricing details
├── config/                    # Configuration files
├── agents/                    # Agent implementations
├── services/                  # External service clients
└── logs/                      # Log files
```

## 🤖 Available Agents

### 1. Sales Agent
- **Purpose**: Explain Orkut 2.0 features and pricing
- **Voice**: ink-whisper (friendly, conversational)
- **Context**: context/sales.md

### 2. Technical Agent
- **Purpose**: Technical support and troubleshooting
- **Voice**: Professional, clear
- **Context**: context/technical.md

### 3. Pricing Agent
- **Purpose**: Help users find the best plan
- **Voice**: Consultative, helpful
- **Context**: context/pricing.md

## 🔧 Configuration

### Environment Variables

```bash
# Cerebras (LLM)
CEREBRAS_API_KEY=csk-your-key-here
CEREBRAS_MODEL=llama-3.3-70b

# Cartesia (Voice)
CARTESIA_API_KEY=sk_car_your-key-here
CARTESIA_VOICE_ID=ink-whisper

# LiveKit
LIVEKIT_URL=wss://orkut-2-0-xxxxx.livekit.cloud
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
DEBUG=false
```

### Auto-Scaling

Edit `livekit.toml`:

```toml
[agent]
min_replicas = 1
max_replicas = 10
target_cpu_percent = 70
```

## 🧪 Testing

### Test Locally (Optional)

```bash
# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run agent
python agent.py
```

### Test in Cloud

1. Visit: https://cloud.livekit.io/playground
2. Select your project
3. Choose "orkut-voice-agent"
4. Click "Connect"
5. Start speaking!

## 📊 Monitoring

### View Status
```bash
lk agent status
```

### Stream Logs
```bash
lk agent logs -f
```

### Dashboard
Visit: https://cloud.livekit.io/dashboard

Metrics available:
- Active sessions
- Error rate
- Average latency
- Throughput
- CPU/Memory usage

## 🔄 Updates

### Deploy New Version

```bash
# Make code changes
# Then deploy
lk agent deploy

# LiveKit performs rolling update with zero downtime
```

### Rollback

```bash
# Rollback to previous version
lk agent rollback

# Or specific version
lk agent rollback --version 1.0.0
```

## 🔐 Security

### Using Secrets (Production)

```bash
# Add secrets securely
lk secret set CEREBRAS_API_KEY "your-key"
lk secret set CARTESIA_API_KEY "your-key"

# List secrets
lk secret list

# Redeploy to use secrets
lk agent deploy
```

### Rotate Secrets

```bash
# Generate new secret
lk secret rotate CEREBRAS_API_KEY

# Update agent
lk agent deploy
```

## 🌐 Frontend Integration

### Install Dependencies

```bash
cd frontend
npm install @livekit/components-react livekit-client @livekit/components-styles
```

### Use VoiceAgent Component

```tsx
import VoiceAgent from './components/VoiceAgent';

<VoiceAgent 
  agentType="sales" 
  onClose={() => setActiveAgent(null)}
/>
```

### Backend API

The backend provides `/api/agents/token` endpoint to generate LiveKit tokens:

```typescript
const response = await fetch('/api/agents/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ agentType: 'sales' })
});

const { token, room, url } = await response.json();
```

## 🆘 Troubleshooting

### Agent Not Starting

```bash
# Check logs
lk agent logs

# Redeploy
lk agent deploy
```

### API Key Errors

```bash
# Verify secrets
lk secret list

# Update secret
lk secret set CEREBRAS_API_KEY "new-key"

# Redeploy
lk agent deploy
```

### Container Build Fails

```bash
# Test Docker build locally
docker build -t orkut-voice-agent .

# Run locally
docker run -e CEREBRAS_API_KEY=xxx orkut-voice-agent

# If works locally, redeploy
lk agent deploy
```

### High Latency

```bash
# Check metrics
lk agent metrics

# Scale up
# Edit livekit.toml: min_replicas = 3
lk agent deploy
```

### Connection Issues

1. Verify LIVEKIT_URL is correct
2. Check firewall allows WebSocket connections
3. Ensure API keys are valid
4. Check agent status: `lk agent status`

## 📚 Resources

- **LiveKit Docs**: https://docs.livekit.io
- **LiveKit Discord**: https://livekit.io/discord
- **Cerebras Docs**: https://cerebras.ai/docs
- **Cartesia Docs**: https://cartesia.ai/docs
- **Project README**: orkut-voice-agent/README.md
- **Detailed Deploy**: orkut-voice-agent/DEPLOY.md
- **Quick Start**: orkut-voice-agent/QUICKSTART.md

## ✅ Deployment Checklist

- [ ] LiveKit CLI installed
- [ ] Authenticated with LiveKit Cloud
- [ ] Project created/selected
- [ ] API keys configured in .env
- [ ] Context files updated
- [ ] Agent created (`lk agent create`)
- [ ] Agent deployed (`lk agent deploy`)
- [ ] Status verified (`lk agent status`)
- [ ] Logs checked (`lk agent logs`)
- [ ] Tested in playground
- [ ] Frontend integrated
- [ ] Backend API configured
- [ ] Monitoring setup

## 🎉 Success!

Your voice agents are now live and ready to interact with users!

**Next Steps:**
1. Test all three agents (sales, technical, pricing)
2. Update context files with your specific information
3. Monitor performance in dashboard
4. Scale as needed
5. Integrate with your frontend

**URLs:**
- Dashboard: https://cloud.livekit.io/dashboard
- Playground: https://cloud.livekit.io/playground
- Agent: wss://orkut-2-0-xxxxx.livekit.cloud

Happy deploying! 🚀
