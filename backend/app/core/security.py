"""
Security utilities
Password hashing, JWT tokens, etc.
"""
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt
import os

# ============================================================
# Password Hashing (Bcrypt com salt)
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # 12 rounds = mais seguro que 10
)

def hash_password(password: str) -> str:
    """Hash password com Bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

# ============================================================
# JWT Tokens (Seguro)
# ============================================================

JWT_SECRET = os.getenv("JWT_SECRET", "change-in-production-use-secrets-manager")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT token com expiration"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow()
    })
    
    # ✅ Use strong secret!
    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode JWT"""
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

def create_refresh_token(data: dict) -> str:
    """Create refresh token (longer expiration)"""
    return create_access_token(
        data,
        expires_delta=timedelta(days=30)
    )
