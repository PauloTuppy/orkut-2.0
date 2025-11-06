# Orkut 2.0 Voice Agent - Windows Deploy Script
# PowerShell script for deploying voice agents to LiveKit Cloud

Write-Host "🚀 Orkut 2.0 Voice Agent Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if LiveKit CLI is installed
Write-Host "Checking LiveKit CLI..." -ForegroundColor Yellow
$lkVersion = lk version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ LiveKit CLI not found!" -ForegroundColor Red
    Write-Host "Install with: winget install LiveKit.LiveKitCLI" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ LiveKit CLI installed: $lkVersion" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Copy .env.example to .env and configure your API keys" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Check authentication
Write-Host "Checking LiveKit authentication..." -ForegroundColor Yellow
$projects = lk project list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with LiveKit Cloud" -ForegroundColor Red
    Write-Host "Run: lk cloud auth" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Authenticated with LiveKit Cloud" -ForegroundColor Green
Write-Host ""

# Check if agent exists
Write-Host "Checking if agent exists..." -ForegroundColor Yellow
$agentStatus = lk agent status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Agent not found, creating..." -ForegroundColor Yellow
    lk agent create orkut-voice-agent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create agent" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Agent created" -ForegroundColor Green
} else {
    Write-Host "✅ Agent exists" -ForegroundColor Green
}
Write-Host ""

# Deploy
Write-Host "Deploying to LiveKit Cloud..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

lk agent deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check logs with: lk agent logs" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""

# Show status
Write-Host "Agent Status:" -ForegroundColor Cyan
lk agent status

Write-Host ""
Write-Host "📊 View logs: lk agent logs -f" -ForegroundColor Yellow
Write-Host "🌐 Dashboard: https://cloud.livekit.io/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Voice agents are now live!" -ForegroundColor Green
