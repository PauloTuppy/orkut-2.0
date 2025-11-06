# Orkut 2.0 Voice Agent

Voice AI agents powered by LiveKit, Cerebras, and Cartesia.

## Features

- 🎤 **Voice Interaction**: Natural voice conversations with AI agents
- 🤖 **Multiple Agents**: Sales, Technical, and Pricing specialists
- ⚡ **Fast Response**: < 2s latency with Cerebras LLaMA 3.3 70B
- 🎯 **Context-Aware**: Agents use curated knowledge bases
- 🔄 **Auto-Scaling**: Handles multiple concurrent sessions

## Quick Start

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

### 2. Authenticate

```bash
lk cloud auth
lk project list
lk project set-default "orkut-2.0"
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Deploy

```bash
# Create agent
lk agent create orkut-voice-agent

# Deploy to cloud
lk agent deploy

# Check status
lk agent status

# View logs
lk agent logs -f
```

## Architecture

```
orkut-voice-agent/
├── agent.py                    # Main agent entry point
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container config
├── context/                    # Knowledge bases
│   ├── sales.md
│   ├── technical.md
│   └── pricing.md
├── config/                     # Configuration
├── agents/                     # Agent implementations
└── services/                   # External service clients
```

## Agents

### Sales Agent
- Explains Orkut 2.0 features
- Discusses pricing plans
- Answers product questions

### Technical Agent
- Provides technical specifications
- Helps with integration
- Troubleshoots issues

### Pricing Agent
- Compares plans
- Calculates ROI
- Explains special offers

## API Keys Required

- **Cerebras**: LLM inference (llama-3.3-70b)
- **Cartesia**: Speech-to-text and text-to-speech
- **LiveKit**: Real-time communication platform

## Monitoring

```bash
# View metrics
lk agent status

# Stream logs
lk agent logs -f

# Dashboard
https://cloud.livekit.io/dashboard
```

## Troubleshooting

### Agent not starting
```bash
lk agent logs
lk agent deploy
```

### API key errors
```bash
lk secret list
lk secret set CEREBRAS_API_KEY "your-key"
```

### Container issues
```bash
docker build -t orkut-voice-agent .
docker run orkut-voice-agent
```

## Frontend Integration

```tsx
import { LiveKitRoom } from '@livekit/react';

<LiveKitRoom
  video={false}
  audio={true}
  token={token}
  serverUrl="wss://orkut-2-0-xxxxx.livekit.cloud"
  onConnected={() => console.log("Connected!")}
/>
```

## License

MIT
