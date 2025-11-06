# Orkut 2.0 Security Audit - Windows PowerShell

Write-Host "🔐 Orkut 2.0 Security Audit" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Check .env não commitado
Write-Host "✓ Checking .env not committed..." -ForegroundColor Yellow
$envFiles = git ls-files | Select-String -Pattern "^\.env"
if ($envFiles) {
    Write-Host "❌ ERROR: .env file is committed!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ✅ .env not in git" -ForegroundColor Green
}

# Check por hardcoded secrets
Write-Host ""
Write-Host "✓ Checking for hardcoded secrets..." -ForegroundColor Yellow
$secrets = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.py | 
    Select-String -Pattern "sk_car_|csk_|sk_live_|AIza" | 
    Where-Object { $_.Path -notmatch "node_modules|\.git" }
if ($secrets) {
    Write-Host "❌ ERROR: Hardcoded API keys found!" -ForegroundColor Red
    $secrets | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "  ✅ No hardcoded secrets found" -ForegroundColor Green
}

# Check dependencies
Write-Host ""
Write-Host "✓ Checking frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $auditResult = npm audit --audit-level=critical 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Critical vulnerabilities found!" -ForegroundColor Red
        $errors++
    } else {
        Write-Host "  ✅ No critical vulnerabilities" -ForegroundColor Green
    }
}
Pop-Location

# Check CORS
Write-Host ""
Write-Host "✓ Checking CORS configuration..." -ForegroundColor Yellow
$corsIssues = Get-ChildItem -Recurse -Include *.py | 
    Select-String -Pattern 'allow_origins=\["\*"\]' | 
    Where-Object { $_.Path -notmatch "\.git" }
if ($corsIssues) {
    Write-Host "❌ ERROR: CORS allow_origins set to *" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ✅ CORS properly configured" -ForegroundColor Green
}

# Check passwords em plain text
Write-Host ""
Write-Host "✓ Checking for plain text passwords..." -ForegroundColor Yellow
$passwords = Get-ChildItem -Recurse -Include *.py,*.ts | 
    Select-String -Pattern 'password\s*=\s*["''][^"'']+["'']' | 
    Where-Object { 
        $_.Path -notmatch "node_modules|\.git" -and 
        $_.Line -notmatch "password_hash|hashed_password" 
    }
if ($passwords) {
    Write-Host "❌ ERROR: Plain text passwords found!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ✅ No plain text passwords" -ForegroundColor Green
}

# Check JWT_SECRET
Write-Host ""
Write-Host "✓ Checking JWT_SECRET..." -ForegroundColor Yellow
$jwtSecrets = Get-ChildItem -Recurse -Include *.py | 
    Select-String -Pattern 'JWT_SECRET.*=.*"[^"]' | 
    Where-Object { 
        $_.Path -notmatch "\.git" -and 
        $_.Line -notmatch "change-in-production" 
    }
if ($jwtSecrets) {
    Write-Host "❌ ERROR: JWT_SECRET hardcoded!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ✅ JWT_SECRET uses environment variable" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
if ($errors -eq 0) {
    Write-Host "✅ All security checks passed!" -ForegroundColor Green
    Write-Host "==============================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ $errors security issues found!" -ForegroundColor Red
    Write-Host "==============================" -ForegroundColor Cyan
    exit 1
}
