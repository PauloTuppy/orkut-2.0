# 🛡️ Security Best Practices - Orkut 2.0

## Overview

This document provides security best practices for developers working on Orkut 2.0.

---

## 🔑 API Keys & Secrets

### ✅ DO

```typescript
// ✅ Use environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Call backend proxy
const response = await api.post('/ai/process-document', { text });
```

```python
# ✅ Use environment variables
import os
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")

# ✅ Use secrets manager in production
from app.config.secrets import secrets_manager
CEREBRAS_API_KEY = secrets_manager.get_secret('orkut/cerebras-key')
```

### ❌ DON'T

```typescript
// ❌ Hardcoded keys
const CEREBRAS_KEY = "csk-r464yj3rvy2r68xhmpx3v2tenf2f6tekvw42rtyh9h2jmkp4";

// ❌ Keys in localStorage
localStorage.setItem('api_key', key);

// ❌ Keys in console.log
console.log("API Key:", apiKey);
```

---

## 🔐 Authentication

### ✅ DO

```python
# ✅ Hash passwords with Bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12)
hashed = pwd_context.hash(password)
```

```typescript
// ✅ Store JWT in httpOnly cookie or secure storage
// Backend sets cookie:
response.set_cookie(
  "access_token",
  token,
  httponly=True,
  secure=True,
  samesite="strict"
);
```

### ❌ DON'T

```python
# ❌ Plain text passwords
user.password = password  # DON'T!

# ❌ Weak hashing
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()  # DON'T!
```

---

## ✅ Input Validation

### ✅ DO

```typescript
// ✅ Validate with Zod
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

const validated = LoginSchema.parse(data);
```

```python
# ✅ Validate with Pydantic
from pydantic import BaseModel, EmailStr, constr

class LoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=128)
```

### ❌ DON'T

```typescript
// ❌ No validation
const email = request.body.email;  // Could be anything!
await loginUser(email, password);
```

---

## 🗄️ Database Security

### ✅ DO

```python
# ✅ Parameterized queries
from sqlalchemy import text

query = text("SELECT * FROM users WHERE email = :email")
result = db.execute(query, {"email": email})
```

```python
# ✅ SQLAlchemy ORM (automatic protection)
user = db.query(User).filter(User.email == email).first()
```

### ❌ DON'T

```python
# ❌ String concatenation (SQL injection!)
query = f"SELECT * FROM users WHERE email = '{email}'"  # DON'T!
result = db.execute(query)
```

---

## 🌐 CORS Configuration

### ✅ DO

```python
# ✅ Explicit whitelist
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://orkut2.com"],  # Specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"]
)
```

### ❌ DON'T

```python
# ❌ Wildcard (insecure!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # DON'T!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

---

## 📊 Logging

### ✅ DO

```python
# ✅ Log without sensitive data
logger.info(f"Login attempt for user: {user_id}")
logger.info(f"Document processed: {doc_id}")
```

```typescript
// ✅ Generic error messages for users
catch (error) {
  setError("Something went wrong. Please try again.");
  // Log details internally
  console.error("Error code:", error.code);
}
```

### ❌ DON'T

```python
# ❌ Log sensitive data
logger.info(f"Login: {email} with password {password}")  # DON'T!
logger.info(f"API Key: {api_key}")  # DON'T!
```

```typescript
// ❌ Expose internal errors to users
catch (error) {
  setError(error.message);  // Could expose internal details!
}
```

---

## 🔒 XSS Protection

### ✅ DO

```typescript
// ✅ Sanitize HTML
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);
```

```typescript
// ✅ Use textContent (not innerHTML)
element.textContent = userInput;
```

### ❌ DON'T

```typescript
// ❌ Direct innerHTML (XSS risk!)
element.innerHTML = userInput;  // DON'T!

// ❌ dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // DON'T!
```

---

## 🚦 Rate Limiting

### ✅ DO

```python
# ✅ Rate limit sensitive endpoints
from app.middleware.rate_limit import LoginRateLimitMiddleware

app.add_middleware(LoginRateLimitMiddleware, max_attempts=5)
```

### ❌ DON'T

```python
# ❌ No rate limiting on login
@app.post("/login")
async def login(credentials: LoginRequest):
    # Vulnerable to brute force!
    return authenticate(credentials)
```

---

## 🔍 Error Handling

### ✅ DO

```typescript
// ✅ Generic error messages
export function handleApiError(error: any): ApiError {
  if (error.response?.status === 500) {
    return {
      message: "Server error. Please try again later.",
      code: "SERVER_ERROR"
    };
  }
  // ...
}
```

### ❌ DON'T

```typescript
// ❌ Expose internal errors
catch (error) {
  alert(error.stack);  // DON'T! Exposes internal details
}
```

---

## 📦 Dependencies

### ✅ DO

```bash
# ✅ Regular audits
npm audit
npm audit fix

# ✅ Update dependencies
npm update

# ✅ Check for vulnerabilities
npm audit --audit-level=critical
```

### ❌ DON'T

```bash
# ❌ Ignore vulnerabilities
npm audit --force  # DON'T ignore warnings!

# ❌ Use outdated packages
# Check package.json for old versions
```

---

## 🔐 HTTPS & TLS

### ✅ DO

```python
# ✅ Enforce HTTPS in production
if not request.is_secure and settings.ENVIRONMENT == "production":
    return redirect(request.url.replace("http://", "https://"))
```

```nginx
# ✅ Nginx HTTPS redirect
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

### ❌ DON'T

```python
# ❌ Allow HTTP in production
# Always enforce HTTPS!
```

---

## 🧪 Testing

### ✅ DO

```python
# ✅ Test authentication
def test_login_with_invalid_credentials():
    response = client.post("/login", json={
        "email": "test@example.com",
        "password": "wrong"
    })
    assert response.status_code == 401

# ✅ Test SQL injection
def test_sql_injection_protection():
    response = client.get("/users?email=' OR '1'='1")
    assert response.status_code == 400
```

### ❌ DON'T

```python
# ❌ Skip security tests
# Always test authentication, authorization, and input validation!
```

---

## 📋 Code Review Checklist

Before approving a PR, check:

- [ ] No hardcoded API keys or secrets
- [ ] Input validation implemented
- [ ] SQL queries parameterized
- [ ] Passwords hashed (not plain text)
- [ ] Error messages don't expose internal details
- [ ] CORS configured properly
- [ ] Rate limiting on sensitive endpoints
- [ ] No sensitive data in logs
- [ ] Dependencies updated
- [ ] Security tests added

---

## 🚨 Security Incidents

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@orkut2.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours.

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security](https://react.dev/learn/security)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

**Remember**: Security is everyone's responsibility! 🔒
