#!/bin/bash

echo "🔐 Orkut 2.0 Security Audit"
echo "=============================="
echo ""

# Check .env não commitado
echo "✓ Checking .env not committed..."
if git ls-files | grep -E "^\\.env($|\.)" > /dev/null; then
    echo "❌ ERROR: .env file is committed!"
    exit 1
fi
echo "  ✅ .env not in git"

# Check por hardcoded secrets (regex)
echo ""
echo "✓ Checking for hardcoded secrets..."
if grep -r "sk_car_\|csk_\|sk_live_\|AIza" --include="*.ts" --include="*.tsx" --include="*.py" . 2>/dev/null | grep -v "node_modules" | grep -v ".git"; then
    echo "❌ ERROR: Hardcoded API keys found!"
    exit 1
fi
echo "  ✅ No hardcoded secrets found"

# Check dependencies
echo ""
echo "✓ Checking frontend dependencies..."
cd frontend
if command -v npm &> /dev/null; then
    npm audit --audit-level=critical
    if [ $? -ne 0 ]; then
        echo "❌ ERROR: Critical vulnerabilities found in frontend!"
        exit 1
    fi
    echo "  ✅ No critical vulnerabilities"
fi
cd ..

# Check CORS no código
echo ""
echo "✓ Checking CORS configuration..."
if grep -r 'allow_origins=\["\\*"\]' --include="*.py" . 2>/dev/null | grep -v ".git"; then
    echo "❌ ERROR: CORS allow_origins set to *"
    exit 1
fi
echo "  ✅ CORS properly configured"

# Check passwords em plain text
echo ""
echo "✓ Checking for plain text passwords..."
if grep -r 'password\s*=\s*["\047][^\s]*["\047]' --include="*.py" --include="*.ts" . 2>/dev/null | grep -v "node_modules" | grep -v ".git" | grep -v "password_hash" | grep -v "hashed_password"; then
    echo "❌ ERROR: Plain text passwords found!"
    exit 1
fi
echo "  ✅ No plain text passwords"

# Check JWT_SECRET
echo ""
echo "✓ Checking JWT_SECRET..."
if grep -r 'JWT_SECRET.*=.*"[^"]' --include="*.py" . 2>/dev/null | grep -v ".git" | grep -v "change-in-production"; then
    echo "❌ ERROR: JWT_SECRET hardcoded!"
    exit 1
fi
echo "  ✅ JWT_SECRET uses environment variable"

# Check console.log com dados sensíveis
echo ""
echo "✓ Checking for sensitive data in console.log..."
if grep -r 'console\.log.*\(.*password\|token\|secret\|key' --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v "node_modules" | grep -v ".git"; then
    echo "⚠️  WARNING: console.log with potentially sensitive data found"
fi
echo "  ✅ Check complete"

echo ""
echo "=============================="
echo "✅ All security checks passed!"
echo "=============================="
