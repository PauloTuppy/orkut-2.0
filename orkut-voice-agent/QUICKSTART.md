# Quick Start Guide - Orkut 2.0 Voice Agent

## 🚀 5-Minute Deploy

### Step 1: Install LiveKit CLI (2 min)

**Windows:**
```powershell
winget install LiveKit.LiveKitCLI
```

**macOS:**
```bash
brew install livekit
```

**Linux:**
```bash
curl -L https://github.com/livekit/cli/releases/latest/download/livekit-linux-amd64.tar.gz -o livekit.tar.gz
tar xzf livekit.tar.gz
sudo mv livekit /usr/local/bin/
```

Verify:
```bash
lk version
```

### Step 2: Authenticate (1 min)

```bash
# Login (opens browser)
lk cloud auth

# Set project
lk project set-default "orkut-2.0"
```

### Step 3: Configure (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your keys:
# - CEREBRAS_API_KEY
# - CARTESIA_API_KEY
# - LIVEKIT credentials
```

### Step 4: Deploy (1 min)

```bash
# Create agent
lk agent create orkut-voice-agent

# Deploy to cloud
lk agent deploy
```

### Step 5: Verify

```bash
# Check status
lk agent status

# View logs
lk agent logs

# Test in playground
# Visit: https://cloud.livekit.io/playground
```

## ✅ Done!

Your voice agents are now live at:
- **Dashboard**: https://cloud.livekit.io/dashboard
- **Agent URL**: wss://orkut-2-0-xxxxx.livekit.cloud

## 🔧 Next Steps

1. **Test locally** (optional):
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python agent.py
   ```

2. **Update context files**:
   - Edit `context/sales.md`
   - Edit `context/technical.md`
   - Edit `context/pricing.md`

3. **Integrate with frontend**:
   ```bash
   cd ../frontend
   npm install @livekit/components-react livekit-client
   ```

4. **Monitor**:
   ```bash
   lk agent logs -f
   ```

## 🆘 Troubleshooting

**Agent not starting?**
```bash
lk agent logs
lk agent deploy
```

**API key errors?**
```bash
lk secret set CEREBRAS_API_KEY "your-key"
lk agent deploy
```

**Need help?**
- Check DEPLOY.md for detailed guide
- Visit https://docs.livekit.io
- Join https://livekit.io/discord
