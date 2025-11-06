# Orkut 2.0 Voice Agent - Deploy Guide

## Prerequisites

- [ ] LiveKit CLI installed (`lk version`)
- [ ] LiveKit Cloud account
- [ ] Cerebras API key
- [ ] Cartesia API key
- [ ] Python 3.11+
- [ ] Docker (optional, for local testing)

## Step 1: Install LiveKit CLI

### Windows
```powershell
winget install LiveKit.LiveKitCLI
lk version
```

### macOS
```bash
brew install livekit
lk version
```

### Linux
```bash
curl -L https://github.com/livekit/cli/releases/latest/download/livekit-linux-amd64.tar.gz -o livekit.tar.gz
tar xzf livekit.tar.gz
sudo mv livekit /usr/local/bin/
lk version
```

## Step 2: Authenticate with LiveKit Cloud

```bash
# Login (opens browser)
lk cloud auth

# List projects
lk project list

# Set default project
lk project set-default "orkut-2.0"
```

## Step 3: Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit with your keys
# Required:
# - CEREBRAS_API_KEY
# - CARTESIA_API_KEY
# - LIVEKIT_URL (from LiveKit dashboard)
# - LIVEKIT_API_KEY
# - LIVEKIT_API_SECRET
```

## Step 4: Test Locally (Optional)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run agent locally
python agent.py
```

## Step 5: Deploy to LiveKit Cloud

```bash
# Create agent in cloud
lk agent create orkut-voice-agent

# Deploy
lk agent deploy

# This will:
# 1. Build Docker image
# 2. Upload to LiveKit Cloud
# 3. Start 2 replicas
# 4. Enable auto-scaling
```

## Step 6: Verify Deployment

```bash
# Check status
lk agent status

# Expected output:
# Agent ID: orkut-voice-agent
# Status: Running
# Replicas: 2
# Version: 1.0.0

# View logs
lk agent logs

# Stream logs in real-time
lk agent logs -f
```

## Step 7: Configure Secrets (Production)

```bash
# Add secrets securely
lk secret set CEREBRAS_API_KEY "csk-your-key"
lk secret set CARTESIA_API_KEY "sk_car_your-key"

# List secrets
lk secret list

# Redeploy to use secrets
lk agent deploy
```

## Step 8: Configure Auto-Scaling

Edit `livekit.toml`:

```toml
[agent]
min_replicas = 1
max_replicas = 10
target_cpu_percent = 70
```

Deploy changes:
```bash
lk agent deploy
```

## Step 9: Monitor

### Dashboard
Visit: https://cloud.livekit.io/dashboard

Metrics available:
- Active sessions
- Error rate
- Average latency
- Throughput

### CLI Monitoring
```bash
# Status
lk agent status

# Logs
lk agent logs -f

# Metrics
lk agent metrics
```

## Step 10: Update Agent

```bash
# Make code changes
# Then deploy new version
lk agent deploy

# LiveKit performs rolling update:
# 1. Builds new image
# 2. Starts new replicas
# 3. Drains old replicas
# 4. Zero downtime
```

## Rollback

If something goes wrong:

```bash
# Rollback to previous version
lk agent rollback

# Or rollback to specific version
lk agent rollback --version 1.0.0
```

## Troubleshooting

### Agent not appearing online

```bash
# Check status
lk agent status

# View logs for errors
lk agent logs

# Redeploy
lk agent deploy
```

### API key errors

```bash
# Verify secrets
lk secret list

# Update secret
lk secret set CEREBRAS_API_KEY "new-key"

# Redeploy
lk agent deploy
```

### Container fails to start

```bash
# Test locally first
docker build -t orkut-voice-agent .
docker run -e CEREBRAS_API_KEY=xxx orkut-voice-agent

# If works locally, redeploy
lk agent deploy
```

### High latency

```bash
# Check metrics
lk agent metrics

# Scale up
# Edit livekit.toml: min_replicas = 3
lk agent deploy
```

## URLs

- **Dashboard**: https://cloud.livekit.io/dashboard
- **Playground**: https://cloud.livekit.io/playground
- **Agent URL**: wss://orkut-2-0-xxxxx.livekit.cloud

## Next Steps

1. Integrate with frontend (see README.md)
2. Add custom agents (see agents/ folder)
3. Update context files (see context/ folder)
4. Monitor performance
5. Scale as needed

## Support

- LiveKit Docs: https://docs.livekit.io
- LiveKit Discord: https://livekit.io/discord
- Cerebras Docs: https://cerebras.ai/docs
- Cartesia Docs: https://cartesia.ai/docs
