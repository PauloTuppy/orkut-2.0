# ============================================================
# 🚀 Orkut 2.0 - Iniciar Backend
# ============================================================

Write-Host "🚀 Iniciando Orkut 2.0 Backend..." -ForegroundColor Cyan

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado! Instale Python 3.8+" -ForegroundColor Red
    exit 1
}

# Verificar se porta 8000 está livre
$portInUse = netstat -ano | Select-String ":8000" | Select-String "LISTENING"
if ($portInUse) {
    Write-Host "⚠️  Porta 8000 já está em uso!" -ForegroundColor Yellow
    Write-Host "Deseja matar o processo? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s") {
        $pid = ($portInUse -split '\s+')[-1]
        taskkill /PID $pid /F
        Write-Host "✅ Processo encerrado" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "❌ Abortando..." -ForegroundColor Red
        exit 1
    }
}

# Navegar para pasta backend
Set-Location backend

# Verificar se dependências estão instaladas
Write-Host "📦 Verificando dependências..." -ForegroundColor Cyan
$hasFastAPI = pip list | Select-String "fastapi"
if (-not $hasFastAPI) {
    Write-Host "⚠️  FastAPI não encontrado. Instalando dependências..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado. Criando..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✅ Tudo pronto! Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend rodando em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📍 Documentação API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "📍 Health Check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Credenciais demo:" -ForegroundColor Yellow
Write-Host "   Email: demo@orkut.com" -ForegroundColor White
Write-Host "   Senha: demo123" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
