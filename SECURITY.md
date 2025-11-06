# 🔐 Orkut 2.0 - Security Guide

## Overview

This document outlines the security measures implemented in Orkut 2.0 to protect user data, API keys, and prevent common vulnerabilities.

## ✅ Security Checklist

### Keys & Secrets
- [x] No API keys in .env.example
- [x] .env added to .gitignore
- [x] Keys stored in environment variables
- [x] No keys in console.log
- [x] Backend proxy for all external APIs

### Authentication
- [x] Passwords hashed with Bcrypt (12 rounds)
- [x] JWT tokens with expiration (24h)
- [x] Refresh tokens (30 days)
- [x] Rate limiting on /login (5 attempts/min)
- [x] Secure token storage

### Input Validation
- [x] Validation with Zod (frontend) and Pydantic (backend)
- [x] HTML sanitization
- [x] URL validation
- [x] SQL injection protection (parameterized queries)

### CORS
- [x] Explicit whitelist (no *)
- [x] Credentials controlled
- [x] Max-age configured

### Logging
- [x] No sensitive data in logs
- [x] Automatic sanitization
- [x] Error tracking ready (Sentry)

### Dependencies
- [x] Regular npm audit
- [x] No critical vulnerabilities
- [x] Dependencies updated

## 🔑 API Keys Management

### Development

```bash
# Copy template
cp .env.example .env

# Edit with your keys (NEVER commit .env!)
# .env
CEREBRAS_API_KEY=your-key-here
CARTESIA_API_KEY=your-key-here
LIVEKIT_API_KEY=your-key-here
```

### Production

**Use AWS Secrets Manager, Google Secret Manager, or similar:**

```python
# backend/config/secrets.py
import boto3

secrets_manager = boto3.client('secretsmanager')

CEREBRAS_API_KEY = secrets_manager.get_secret_value(
    SecretId='orkut/cerebras-key'
)['SecretString']
```

## 🛡️ Security Features

### 1. Password Security

```python
# backend/app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12  # Strong hashing
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
```

### 2. JWT Tokens

```python
# backend/app/core/security.py
def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {"exp": expire, "iat": datetime.utcnow(), **data}
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
```

### 3. Rate Limiting

```python
# backend/app/middleware/rate_limit.py
class LoginRateLimitMiddleware:
    max_attempts = 5  # 5 attempts per 5 minutes
```

### 4. Input Validation

```typescript
// frontend/src/utils/validation.ts
export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain special char')
});
```

### 5. SQL Injection Protection

```python
# ✅ SAFE: Parameterized queries
from sqlalchemy import text

query = text("SELECT * FROM users WHERE email = :email")
db.execute(query, {"email": email})

# ❌ UNSAFE: String concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"  # DON'T DO THIS!
```

### 6. XSS Protection

```typescript
// frontend/src/utils/validation.ts
export function sanitizeHtml(dirty: string): string {
  const temp = document.createElement('div');
  temp.textContent = dirty;
  return temp.innerHTML;
}
```

### 7. CORS Configuration

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Explicit whitelist
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"]
)
```

## 🔍 Security Audit

Run security audit before deployment:

**Linux/macOS:**
```bash
chmod +x scripts/security-audit.sh
./scripts/security-audit.sh
```

**Windows:**
```powershell
.\scripts\security-audit.ps1
```

The audit checks for:
- .env files in git
- Hardcoded API keys
- Critical vulnerabilities
- CORS misconfigurations
- Plain text passwords
- Sensitive data in logs

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please email:
- **Email**: security@orkut2.com
- **Do NOT** create a public GitHub issue

We will respond within 48 hours.

## 📚 Best Practices

### DO ✅

- Use environment variables for secrets
- Hash passwords with Bcrypt (12+ rounds)
- Validate all user input
- Use parameterized SQL queries
- Implement rate limiting
- Log errors without sensitive data
- Use HTTPS in production
- Keep dependencies updated
- Run security audits regularly

### DON'T ❌

- Commit .env files
- Hardcode API keys
- Log passwords or tokens
- Use `allow_origins=["*"]` in CORS
- Concatenate strings in SQL queries
- Store passwords in plain text
- Expose internal error details to users
- Skip input validation
- Use weak JWT secrets

## 🔄 Security Updates

- **Monthly**: Run `npm audit` and update dependencies
- **Weekly**: Review logs for suspicious activity
- **Daily**: Monitor error rates and failed login attempts

## 📖 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://react.dev/learn/security)

## 📝 License

This security guide is part of Orkut 2.0 and follows the same MIT license.

---

**Last Updated**: November 2025  
**Version**: 1.0.0
