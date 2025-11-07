# Script para instalar dependências do backend
Write-Host "🔧 Instalando dependências do backend..." -ForegroundColor Cyan

# Navegar para o diretório do backend
Set-Location backend

# Instalar dependências
Write-Host "`n📦 Instalando pacotes Python..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "`n✅ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host "`n💡 Agora você pode iniciar o backend com:" -ForegroundColor Cyan
Write-Host "   uvicorn app.main:app --reload" -ForegroundColor White

# Voltar ao diretório raiz
Set-Location ..
