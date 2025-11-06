# test-ai-endpoints.ps1
# Script para testar todos os endpoints de AI do Orkut 2.0

Write-Host "Testando Endpoints de AI - Orkut 2.0" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Test 1: Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "OK Backend esta rodando!" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO Backend nao esta respondendo!" -ForegroundColor Red
    Write-Host "   Execute: cd backend && uvicorn app.main:app --reload" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Gist Memory
Write-Host "2. Gist Memory (Resumo de Documento)..." -ForegroundColor Yellow
try {
    $body = @{
        content = "Python e uma linguagem de programacao de alto nivel, interpretada e de proposito geral. Foi criada por Guido van Rossum e lancada em 1991. Python e conhecida por sua sintaxe clara e legivel, o que a torna ideal para iniciantes. E amplamente usada em desenvolvimento web, ciencia de dados, inteligencia artificial, automacao e muito mais. Frameworks populares incluem Django e Flask para web, e bibliotecas como NumPy, Pandas e TensorFlow para ciencia de dados e machine learning."
        title = "Introducao ao Python"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/gist-memory" -Method Post -Body $body -ContentType "application/json"
    Write-Host "OK Gist Memory funcionando!" -ForegroundColor Green
    Write-Host "   Total de paginas: $($response.total_pages)" -ForegroundColor Gray
    Write-Host "   Primeiro resumo: $($response.gists[0].Substring(0, 80))..." -ForegroundColor Gray
} catch {
    Write-Host "ERRO no Gist Memory: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Voices
Write-Host "3. Listando Vozes Disponiveis..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/voices" -Method Get
    Write-Host "OK Vozes carregadas!" -ForegroundColor Green
    foreach ($voice in $response.voices) {
        Write-Host "   Voz: $($voice.name) ($($voice.language))" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERRO ao listar vozes: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Text-to-Speech
Write-Host "4. Text-to-Speech..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/text-to-speech?text=Ola" -Method Post
    Write-Host "OK TTS funcionando!" -ForegroundColor Green
    Write-Host "   Tamanho do audio: $($response.size) bytes" -ForegroundColor Gray
} catch {
    Write-Host "ERRO no TTS: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: LiveKit Rooms
Write-Host "5. Listando Salas LiveKit..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/rooms" -Method Get
    Write-Host "OK Salas carregadas!" -ForegroundColor Green
    foreach ($room in $response.rooms) {
        Write-Host "   Sala: $($room.name) - $($room.participants) participantes" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERRO ao listar salas: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Criar Sala
Write-Host "6. Criando Nova Sala..." -ForegroundColor Yellow
try {
    $roomName = "Teste-$(Get-Random -Maximum 1000)"
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/rooms?room_name=$roomName" -Method Post
    Write-Host "OK Sala criada!" -ForegroundColor Green
    Write-Host "   Nome: $($response.room_name)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO ao criar sala: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Criar Token
Write-Host "7. Gerando Token de Acesso..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/token?room_name=Desenvolvimento&user_name=TestUser" -Method Post
    Write-Host "OK Token gerado!" -ForegroundColor Green
    Write-Host "   Token: $($response.token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host "   URL: $($response.url)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO ao gerar token: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Testes Concluidos!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos Passos:" -ForegroundColor Cyan
Write-Host "   1. Acesse http://localhost:3000" -ForegroundColor White
Write-Host "   2. Faca login" -ForegroundColor White
Write-Host "   3. Clique no menu AI no header" -ForegroundColor White
Write-Host "   4. Teste cada funcionalidade" -ForegroundColor White
Write-Host ""
