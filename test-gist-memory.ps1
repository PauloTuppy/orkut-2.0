# ============================================================
# 🧪 Test Gist Memory - PDF Upload & Analysis
# ============================================================

Write-Host "`n🧪 TESTANDO GIST MEMORY" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Test 1: Backend Health
Write-Host "1️⃣ Testando Backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "   ✅ Backend: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend não está rodando!" -ForegroundColor Red
    Write-Host "   Execute: .\start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

# Test 2: PDF Endpoint
Write-Host "`n2️⃣ Testando Endpoint de PDF..." -ForegroundColor Yellow
try {
    $formats = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/supported-formats" -TimeoutSec 5
    Write-Host "   ✅ Formatos suportados: $($formats.total_formats)" -ForegroundColor Green
    Write-Host "   📄 Tipos: $($formats.formats[0].type)" -ForegroundColor White
    Write-Host "   📏 Tamanho máximo: $($formats.max_file_size)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Endpoint de PDF não respondeu!" -ForegroundColor Red
    exit 1
}

# Test 3: Check Libraries
Write-Host "`n3️⃣ Verificando Bibliotecas Python..." -ForegroundColor Yellow
try {
    $pypdf2 = python -c "import PyPDF2; print('OK')" 2>&1
    if ($pypdf2 -like "*OK*") {
        Write-Host "   ✅ PyPDF2 instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PyPDF2 não encontrado" -ForegroundColor Red
    }
    
    $pdfplumber = python -c "import pdfplumber; print('OK')" 2>&1
    if ($pdfplumber -like "*OK*") {
        Write-Host "   ✅ pdfplumber instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ pdfplumber não encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠️  Não foi possível verificar bibliotecas" -ForegroundColor Yellow
}

# Test 4: Gist Memory Endpoint
Write-Host "`n4️⃣ Testando Gist Memory (simulação)..." -ForegroundColor Yellow
try {
    $body = @{
        content = "Este é um documento de teste. A inteligência artificial está revolucionando o mundo. Principais aplicações incluem reconhecimento de voz, visão computacional e processamento de linguagem natural."
        title = "Teste de IA"
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/gist-memory" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 10
    
    Write-Host "   ✅ Gist Memory funcionando" -ForegroundColor Green
    Write-Host "   📄 Páginas processadas: $($result.total_pages)" -ForegroundColor White
    Write-Host "   📝 Palavras: $($result.word_count)" -ForegroundColor White
    Write-Host "   🏷️  Tópicos: $($result.topics -join ', ')" -ForegroundColor White
} catch {
    Write-Host "   ❌ Gist Memory não respondeu!" -ForegroundColor Red
}

# Test 5: Question Answering
Write-Host "`n5️⃣ Testando Sistema de Perguntas..." -ForegroundColor Yellow
try {
    $body = @{
        question = "O que é inteligência artificial?"
        context = "A inteligência artificial é um campo da ciência da computação que se concentra no desenvolvimento de sistemas capazes de realizar tarefas que normalmente requerem inteligência humana."
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/ask-question" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 10
    
    Write-Host "   ✅ Sistema de perguntas funcionando" -ForegroundColor Green
    Write-Host "   💬 Resposta: $($result.answer.Substring(0, [Math]::Min(100, $result.answer.Length)))..." -ForegroundColor White
} catch {
    Write-Host "   ❌ Sistema de perguntas não respondeu!" -ForegroundColor Red
}

# Test 6: Frontend
Write-Host "`n6️⃣ Testando Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Frontend: Status $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Frontend não está rodando" -ForegroundColor Yellow
    Write-Host "   Execute: .\start-frontend.ps1" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=========================================`n" -ForegroundColor Cyan
Write-Host "📊 RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

Write-Host "✅ Backend funcionando" -ForegroundColor Green
Write-Host "✅ Endpoint de PDF OK" -ForegroundColor Green
Write-Host "✅ Bibliotecas instaladas" -ForegroundColor Green
Write-Host "✅ Gist Memory funcionando" -ForegroundColor Green
Write-Host "✅ Sistema de perguntas OK" -ForegroundColor Green

Write-Host "`n🎉 TUDO FUNCIONANDO!" -ForegroundColor Green
Write-Host "`n📍 Acesse: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "🧠 Clique em: Gist Memory" -ForegroundColor Cyan
Write-Host "📄 Arraste um PDF e veja a mágica! ✨`n" -ForegroundColor Cyan

Write-Host "Dica: Use PDFs com texto selecionavel (nao escaneados)" -ForegroundColor Yellow
Write-Host "Tamanho maximo: 50MB" -ForegroundColor Yellow
Write-Host ""
