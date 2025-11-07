# Teste de Upload P2P
Write-Host "🎵 Testando Sistema P2P - Orkut 2.0" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Verificar se backend está rodando
Write-Host "1. Verificando Backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET
    Write-Host "✅ Backend rodando: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está rodando!" -ForegroundColor Red
    exit 1
}

# 2. Verificar estatísticas P2P
Write-Host "2. Verificando P2P Stats..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/p2p/stats" -Method GET
    Write-Host "✅ P2P ativo: $($stats.network_status)" -ForegroundColor Green
    Write-Host "   Peers Online: $($stats.online_peers)" -ForegroundColor White
    Write-Host "   Arquivos: $($stats.total_files)" -ForegroundColor White
    Write-Host "   Downloads: $($stats.total_downloads)" -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao acessar P2P stats!" -ForegroundColor Red
    exit 1
}

# 3. Listar arquivos
Write-Host "3. Listando Arquivos..." -ForegroundColor Yellow
try {
    $files = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/p2p/files" -Method GET
    Write-Host "✅ Arquivos encontrados: $($files.total)" -ForegroundColor Green
    
    if ($files.total -gt 0) {
        Write-Host "📁 Arquivos disponíveis:" -ForegroundColor Cyan
        foreach ($file in $files.files) {
            $size = [math]::Round($file.size / 1024 / 1024, 2)
            Write-Host "   🎵 $($file.original_name) - ${size}MB" -ForegroundColor White
            if ($file.is_audio) {
                Write-Host "      🎧 Arquivo de áudio - Pode ser reproduzido!" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "📁 Nenhum arquivo encontrado" -ForegroundColor Yellow
        Write-Host "   💡 Faça upload de um MP3 em: http://localhost:3000/p2p" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erro ao listar arquivos!" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar frontend
Write-Host "4. Verificando Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend rodando na porta 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend não está acessível!" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "🎯 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "1. 🌐 Acesse: http://localhost:3000/p2p" -ForegroundColor White
Write-Host "2. 📤 Clique em 'Upload' (botão roxo)" -ForegroundColor White
Write-Host "3. 🎵 Selecione categoria 'Música'" -ForegroundColor White
Write-Host "4. 📁 Escolha um arquivo MP3" -ForegroundColor White
Write-Host "5. ⏳ Aguarde o upload" -ForegroundColor White
Write-Host "6. 🎧 Clique 'Play' para tocar!" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🎵 SISTEMA P2P PRONTO PARA USO! 🚀" -ForegroundColor Green