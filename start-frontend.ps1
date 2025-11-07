# ============================================================
# 🎨 Orkut 2.0 - Iniciar Frontend
# ============================================================

Write-Host "🎨 Iniciando Orkut 2.0 Frontend..." -ForegroundColor Cyan

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado! Instale Node.js 18+" -ForegroundColor Red
    exit 1
}

# Navegar para pasta frontend
Set-Location frontend

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado. Criando..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:8000/api" | Out-File -FilePath ".env" -Encoding UTF8
}

Write-Host ""
Write-Host "✅ Tudo pronto! Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Frontend rodando em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Ou: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Certifique-se que o backend está rodando!" -ForegroundColor Yellow
Write-Host "   Execute: .\start-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
npm run dev
