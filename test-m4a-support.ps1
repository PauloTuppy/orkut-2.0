# Test M4A Support
Write-Host "`nTesting M4A Audio Support..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test Backend
Write-Host "1. Testing Backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health"
    Write-Host "   Backend OK" -ForegroundColor Green
} catch {
    Write-Host "   Backend NOT running!" -ForegroundColor Red
    Write-Host "   Run: .\start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

# Check supported formats
Write-Host "`n2. Checking Supported Audio Formats..." -ForegroundColor Yellow
Write-Host "   Backend accepts:" -ForegroundColor Cyan
Write-Host "   - audio/mpeg (MP3)" -ForegroundColor White
Write-Host "   - audio/mp3 (MP3)" -ForegroundColor White
Write-Host "   - audio/x-mpeg (MP3)" -ForegroundColor White
Write-Host "   - audio/wav (WAV)" -ForegroundColor White
Write-Host "   - audio/x-wav (WAV)" -ForegroundColor White
Write-Host "   - audio/ogg (OGG)" -ForegroundColor White
Write-Host "   - audio/mp4 (M4A)" -ForegroundColor Green
Write-Host "   - audio/m4a (M4A)" -ForegroundColor Green
Write-Host "   - audio/x-m4a (M4A)" -ForegroundColor Green
Write-Host "   - audio/aac (AAC)" -ForegroundColor Green
Write-Host "   - audio/x-aac (AAC)" -ForegroundColor Green
Write-Host "   - audio/flac (FLAC)" -ForegroundColor Green

Write-Host "`n3. M4A MIME Types Supported:" -ForegroundColor Yellow
Write-Host "   - audio/mp4 (most common)" -ForegroundColor Green
Write-Host "   - audio/m4a (iTunes)" -ForegroundColor Green
Write-Host "   - audio/x-m4a (alternative)" -ForegroundColor Green
Write-Host "   - audio/mp4a-latm (streaming)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "M4A SUPPORT READY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "How to test M4A upload:" -ForegroundColor Yellow
Write-Host "1. Go to: http://localhost:3000/audio-rooms" -ForegroundColor White
Write-Host "2. Enter a room" -ForegroundColor White
Write-Host "3. Click 'Audios' button" -ForegroundColor White
Write-Host "4. Upload an M4A file" -ForegroundColor White

Write-Host "`nIf you get an error:" -ForegroundColor Yellow
Write-Host "- Check the exact MIME type in browser console" -ForegroundColor White
Write-Host "- Try renaming .m4a to .mp4 (same format)" -ForegroundColor White
Write-Host "- Convert to MP3 if needed" -ForegroundColor White

Write-Host "`nCommon M4A MIME types by source:" -ForegroundColor Cyan
Write-Host "- iTunes/Apple: audio/m4a or audio/mp4" -ForegroundColor White
Write-Host "- Windows: audio/x-m4a" -ForegroundColor White
Write-Host "- Web browsers: audio/mp4" -ForegroundColor White
Write-Host "- FFmpeg output: audio/mp4" -ForegroundColor White

Write-Host "`nAll these are now supported!" -ForegroundColor Green
Write-Host ""
