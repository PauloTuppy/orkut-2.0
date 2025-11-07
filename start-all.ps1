# ============================================================
# 🚀 Orkut 2.0 - Iniciar Backend + Frontend
# ============================================================

Write-Host "🚀 Iniciando Orkut 2.0 (Backend + Frontend)..." -ForegroundColor Cyan
Write-Host ""

# Verificar Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependências (se necessário)..." -ForegroundColor Cyan

# Backend
if (-not (Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env" -ErrorAction SilentlyContinue
}

# Frontend
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Iniciando servidores..." -ForegroundColor Green
Write-Host ""

# Iniciar Backend em nova janela
Write-Host "🔧 Iniciando Backend (porta 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Aguardar backend iniciar
Write-Host "⏳ Aguardando backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Testar backend
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "✅ Backend OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend pode não estar pronto ainda..." -ForegroundColor Yellow
}

# Iniciar Frontend em nova janela
Write-Host "🎨 Iniciando Frontend (porta 3000/5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Orkut 2.0 iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000 ou http://localhost:5173" -ForegroundColor White
Write-Host "   Backend: http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 Credenciais demo:" -ForegroundColor Yellow
Write-Host "   Email: demo@orkut.com" -ForegroundColor White
Write-Host "   Senha: demo123" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar: Feche as janelas do PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
