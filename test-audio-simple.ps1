# Test Audio Upload
Write-Host "Testing Audio Upload System..." -ForegroundColor Cyan

# Test Backend
Write-Host "`n1. Testing Backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health"
    Write-Host "   Backend OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   Backend NOT running!" -ForegroundColor Red
    Write-Host "   Run: .\start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

# Test P2P Endpoint
Write-Host "`n2. Testing P2P Endpoint..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/p2p/stats"
    Write-Host "   P2P OK" -ForegroundColor Green
    Write-Host "   Files: $($stats.total_files)" -ForegroundColor White
    Write-Host "   Network: $($stats.network_status)" -ForegroundColor White
} catch {
    Write-Host "   P2P endpoint error!" -ForegroundColor Red
    exit 1
}

# Test List Files
Write-Host "`n3. Listing Files..." -ForegroundColor Yellow
try {
    $files = Invoke-RestMethod -Uri "http://localhost:8000/api/ai/p2p/files"
    Write-Host "   Total files: $($files.total)" -ForegroundColor Green
} catch {
    Write-Host "   Error listing files" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "SYSTEM READY FOR AUDIO UPLOAD!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "How to test:" -ForegroundColor Yellow
Write-Host "1. Go to: http://localhost:3000/audio-rooms" -ForegroundColor White
Write-Host "2. Enter a room" -ForegroundColor White
Write-Host "3. Click 'Audios' button" -ForegroundColor White
Write-Host "4. Try:" -ForegroundColor White
Write-Host "   - Record audio (needs microphone)" -ForegroundColor Cyan
Write-Host "   - Upload file (MP3, WAV, OGG)" -ForegroundColor Cyan

Write-Host "`nSupported formats:" -ForegroundColor Yellow
Write-Host "   MP3, WAV, OGG, M4A (max 100MB)" -ForegroundColor White

Write-Host ""
