#!/bin/bash
# Orkut 2.0 Voice Agent - Linux/macOS Deploy Script

set -e

echo "🚀 Orkut 2.0 Voice Agent Deployment"
echo "====================================="
echo ""

# Check if LiveKit CLI is installed
echo "Checking LiveKit CLI..."
if ! command -v lk &> /dev/null; then
    echo "❌ LiveKit CLI not found!"
    echo "Install with:"
    echo "  macOS: brew install livekit"
    echo "  Linux: curl -L https://github.com/livekit/cli/releases/latest/download/livekit-linux-amd64.tar.gz -o livekit.tar.gz && tar xzf livekit.tar.gz && sudo mv livekit /usr/local/bin/"
    exit 1
fi
echo "✅ LiveKit CLI installed: $(lk version)"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Copy .env.example to .env and configure your API keys"
    exit 1
fi
echo "✅ .env file found"
echo ""

# Check authentication
echo "Checking LiveKit authentication..."
if ! lk project list &> /dev/null; then
    echo "❌ Not authenticated with LiveKit Cloud"
    echo "Run: lk cloud auth"
    exit 1
fi
echo "✅ Authenticated with LiveKit Cloud"
echo ""

# Check if agent exists
echo "Checking if agent exists..."
if ! lk agent status &> /dev/null; then
    echo "⚠️  Agent not found, creating..."
    lk agent create orkut-voice-agent
    echo "✅ Agent created"
else
    echo "✅ Agent exists"
fi
echo ""

# Deploy
echo "Deploying to LiveKit Cloud..."
echo "This may take a few minutes..."
echo ""

lk agent deploy

echo ""
echo "✅ Deployment successful!"
echo ""

# Show status
echo "Agent Status:"
lk agent status

echo ""
echo "📊 View logs: lk agent logs -f"
echo "🌐 Dashboard: https://cloud.livekit.io/dashboard"
echo ""
echo "🎉 Voice agents are now live!"
