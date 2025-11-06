# 🎯 Complete Voice Agent Setup - Start to Finish

This guide walks you through the complete setup of Orkut 2.0 voice agents from zero to production.

## 📋 What You'll Build

By the end of this guide, you'll have:
- ✅ 3 AI voice agents (Sales, Technical, Pricing)
- ✅ Powered by Cerebras LLaMA 3.3 70B (ultra-fast inference)
- ✅ Natural voice with Cartesia STT/TTS
- ✅ Deployed on LiveKit Cloud (auto-scaling)
- ✅ Integrated with your React frontend
- ✅ Production-ready monitoring

## ⏱️ Time Required

- **Quick Setup**: 5-10 minutes (if you have all API keys)
- **Full Setup**: 30 minutes (including account creation)

---

## 🎬 Part 1: Get Your API Keys (10 min)

### 1.1 LiveKit Cloud Account

1. Go to: https://cloud.livekit.io
2. Sign up (free tier available)
3. Create a new project: "orkut-2.0"
4. Note your:
   - Project subdomain: `orkut-2-0-xxxxx`
   - API Key: `devkey`
   - API Secret: `secret`

### 1.2 Cerebras API Key

1. Go to: https://cerebras.ai
2. Sign up for API access
3. Get your API key: `csk-...`
4. Model: `llama-3.3-70b` (ultra-fast, 2000 tokens/sec)

### 1.3 Cartesia API Key

1. Go to: https://cartesia.ai
2. Sign up for API access
3. Get your API key: `sk_car_...`
4. Voice IDs available:
   - `ink-whisper` (friendly, conversational)
   - `bf0a246a-8642-498a-9950-80c35e9276b5` (professional)
   - `4df027cb-2920-4a1f-8c34-f21529d5c3fe` (consultative)

---

## 🛠️ Part 2: Install LiveKit CLI (2 min)

### Windows

```powershell
# Install via Winget
winget install LiveKit.LiveKitCLI

# Verify
lk version
# Output: LiveKit CLI v0.x.x
```

### macOS

```bash
# Install via Homebrew
brew install livekit

# Verify
lk version
```

### Linux

```bash
# Download and install
curl -L https://github.com/livekit/cli/releases/latest/download/livekit-linux-amd64.tar.gz -o livekit.tar.gz
tar xzf livekit.tar.gz
sudo mv livekit /usr/local/bin/

# Verify
lk version
```

---

## 🔐 Part 3: Authenticate (1 min)

```bash
# Login to LiveKit Cloud (opens browser)
lk cloud auth

# List your projects
lk project list
# Output:
# ✓ orkut-2.0 (subdomain: orkut-2-0-xxxxx)

# Set default project
lk project set-default "orkut-2.0"

# Verify
lk project list
# Should show ✓ next to orkut-2.0
```

---

## ⚙️ Part 4: Configure Environment (3 min)

```bash
# Navigate to voice agent folder
cd orkut-voice-agent

# Copy environment template
cp .env.example .env

# Edit .env with your favorite editor
# Windows: notepad .env
# macOS/Linux: nano .env
```

**Required configuration in .env:**

```bash
# Cerebras (LLM)
CEREBRAS_API_KEY=csk-your-actual-key-here
CEREBRAS_MODEL=llama-3.3-70b

# Cartesia (Voice)
CARTESIA_API_KEY=sk_car_your-actual-key-here
CARTESIA_VOICE_ID=ink-whisper
CARTESIA_TTS_VOICE_ID=bf0a246a-8642-498a-9950-80c35e9276b5

# LiveKit (from your dashboard)
LIVEKIT_URL=wss://orkut-2-0-xxxxx.livekit.cloud
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
DEBUG=false
```

**Save and close the file.**

---

## 🚀 Part 5: Deploy to Cloud (2 min)

### Option A: Automated Script

**Windows:**
```powershell
.\deploy.ps1
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Manual Commands

```bash
# Create agent in cloud
lk agent create orkut-voice-agent
# Output: ✅ Agent created with ID: orkut-voice-agent

# Deploy to cloud
lk agent deploy
# This will:
# 1. Build Docker image
# 2. Upload to LiveKit Cloud
# 3. Start 2 replicas
# 4. Enable auto-scaling

# Wait for deployment (1-2 minutes)
# You'll see:
# 🔨 Building image...
# ⬆️  Uploading to cloud...
# 🚀 Deploying...
# ✅ Deployment complete!
```

---

## ✅ Part 6: Verify Deployment (1 min)

```bash
# Check agent status
lk agent status

# Expected output:
# Agent ID: orkut-voice-agent
# Status: Running
# Replicas: 2/2
# Version: 1.0.0
# Created: 2 minutes ago

# View logs
lk agent logs

# Stream logs in real-time
lk agent logs -f
```

---

## 🧪 Part 7: Test Your Agents (5 min)

### Test in LiveKit Playground

1. Go to: https://cloud.livekit.io/playground
2. Select project: "orkut-2.0"
3. Select agent: "orkut-voice-agent"
4. Click "Connect"
5. Allow microphone access
6. Start speaking!

**Try these test phrases:**
- "Tell me about Orkut 2.0"
- "What features do you have?"
- "How much does it cost?"
- "What's the difference between Free and Pro?"

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

# You should see:
# 🚀 Orkut 2.0 Voice Agent Starting...
# 📡 LiveKit URL: wss://orkut-2-0-xxxxx.livekit.cloud
# 🤖 Cerebras Model: llama-3.3-70b
# 🎤 Cartesia Voice: ink-whisper
# ✅ SalesAgent initialized
# ✅ TechnicalAgent initialized
# ✅ PricingAgent initialized
# 🟢 Starting LiveKit Agent
```

---

## 🎨 Part 8: Integrate with Frontend (5 min)

### 8.1 Install Dependencies

```bash
cd ../frontend

npm install @livekit/components-react@^2.0.0 \
            @livekit/components-styles@^1.0.12 \
            livekit-client@^2.0.0
```

### 8.2 Configure Frontend Environment

```bash
# Create/edit frontend/.env
echo "VITE_LIVEKIT_URL=wss://orkut-2-0-xxxxx.livekit.cloud" >> .env
```

### 8.3 Use VoiceAgent Component

The component is already created at `frontend/src/components/VoiceAgent.tsx`

It's already integrated in `frontend/src/pages/AudioRooms.tsx`

### 8.4 Start Frontend

```bash
npm run dev
```

Visit: http://localhost:5173

Navigate to: **Audio Rooms** page

You'll see the Voice AI Agents section with 3 buttons:
- 🎤 Sales Agent
- 🔧 Technical Support
- 💰 Pricing Specialist

Click any button to start talking!

---

## 🔧 Part 9: Backend API Setup (3 min)

### 9.1 Install Backend Dependencies

```bash
cd ../backend

# Add to requirements.txt (already done)
# livekit==0.9.0
# livekit-api==0.5.0

pip install -r requirements.txt
```

### 9.2 Configure Backend Environment

```bash
# Add to backend/.env or root .env
echo "LIVEKIT_URL=wss://orkut-2-0-xxxxx.livekit.cloud" >> ../.env
echo "LIVEKIT_API_KEY=devkey" >> ../.env
echo "LIVEKIT_API_SECRET=secret" >> ../.env
```

### 9.3 Start Backend

```bash
# From root directory
docker compose up -d backend

# Or run directly
cd backend
uvicorn app.main:app --reload
```

The API endpoint `/api/agents/token` is now available!

---

## 📊 Part 10: Monitor & Scale (Ongoing)

### View Dashboard

Visit: https://cloud.livekit.io/dashboard

You'll see:
- 📈 Active sessions
- ⚡ Average latency
- 🔴 Error rate
- 💻 CPU/Memory usage
- 📊 Throughput

### View Logs

```bash
# Stream logs
lk agent logs -f

# Filter by level
lk agent logs --level ERROR

# Last 100 lines
lk agent logs --tail 100
```

### Scale Up/Down

Edit `livekit.toml`:

```toml
[agent]
min_replicas = 1    # Minimum instances
max_replicas = 10   # Maximum instances
target_cpu_percent = 70  # Scale trigger
```

Deploy changes:
```bash
lk agent deploy
```

---

## 🎯 Part 11: Customize Agents (Optional)

### Update Context Files

Edit the knowledge bases:

```bash
# Sales information
nano context/sales.md

# Technical specs
nano context/technical.md

# Pricing details
nano context/pricing.md
```

### Deploy Updates

```bash
lk agent deploy
```

LiveKit performs rolling update with zero downtime!

---

## 🔐 Part 12: Production Security

### Use Secrets Manager

```bash
# Add secrets securely
lk secret set CEREBRAS_API_KEY "your-key"
lk secret set CARTESIA_API_KEY "your-key"

# List secrets (values hidden)
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

---

## 🆘 Troubleshooting

### Problem: Agent not starting

**Solution:**
```bash
lk agent logs
# Look for errors
# Common issues:
# - Invalid API keys
# - Missing dependencies
# - Network issues

# Redeploy
lk agent deploy
```

### Problem: High latency

**Solution:**
```bash
# Check metrics
lk agent metrics

# Scale up
# Edit livekit.toml: min_replicas = 3
lk agent deploy
```

### Problem: API key errors

**Solution:**
```bash
# Verify secrets
lk secret list

# Update secret
lk secret set CEREBRAS_API_KEY "new-key"

# Redeploy
lk agent deploy
```

### Problem: Container build fails

**Solution:**
```bash
# Test locally
docker build -t orkut-voice-agent .

# If works, redeploy
lk agent deploy
```

---

## ✅ Success Checklist

- [ ] LiveKit CLI installed and working
- [ ] Authenticated with LiveKit Cloud
- [ ] Project created and selected
- [ ] All API keys configured
- [ ] Agent created in cloud
- [ ] Agent deployed successfully
- [ ] Status shows "Running"
- [ ] Logs show no errors
- [ ] Tested in playground
- [ ] Frontend dependencies installed
- [ ] Backend API configured
- [ ] Can talk to agents from frontend
- [ ] Monitoring dashboard accessible

---

## 🎉 You're Done!

Your voice agents are now:
- ✅ Live in production
- ✅ Auto-scaling
- ✅ Monitored
- ✅ Integrated with frontend
- ✅ Ready for users

**URLs:**
- Dashboard: https://cloud.livekit.io/dashboard
- Playground: https://cloud.livekit.io/playground
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

**Next Steps:**
1. Customize context files with your content
2. Add more agents if needed
3. Monitor performance
4. Scale as traffic grows
5. Collect user feedback

---

## 📚 Additional Resources

- [LiveKit Docs](https://docs.livekit.io)
- [Cerebras Docs](https://cerebras.ai/docs)
- [Cartesia Docs](https://cartesia.ai/docs)
- [Project README](./README.md)
- [Quick Start](./QUICKSTART.md)
- [Detailed Deploy](./DEPLOY.md)

---

## 💡 Tips

1. **Test locally first** before deploying to cloud
2. **Monitor logs** regularly for issues
3. **Update context files** with accurate information
4. **Scale proactively** before traffic spikes
5. **Rotate secrets** regularly for security
6. **Use secrets manager** in production
7. **Enable monitoring** alerts
8. **Keep dependencies** updated

---

## 🎊 Congratulations!

You've successfully deployed production-ready voice AI agents!

Your users can now have natural voice conversations with AI agents that:
- Respond in < 2 seconds
- Understand context
- Speak naturally
- Scale automatically
- Work 24/7

Happy deploying! 🚀
