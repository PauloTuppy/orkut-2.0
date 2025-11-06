"""
Rate Limiting Middleware
Previne brute force e abuse
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict, Tuple
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limit por IP
    """
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = {}
        
    async def dispatch(self, request: Request, call_next):
        # Get IP
        ip = request.client.host if request.client else 'unknown'
        
        # Get current time
        now = time.time()
        
        # Clean old requests (older than 1 minute)
        if ip in self.requests:
            self.requests[ip] = [
                req_time for req_time in self.requests[ip]
                if now - req_time < 60
            ]
        else:
            self.requests[ip] = []
        
        # Check limit
        if len(self.requests[ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later."
            )
        
        # Add current request
        self.requests[ip].append(now)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(
            self.requests_per_minute - len(self.requests[ip])
        )
        
        return response


class LoginRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limit específico para login (mais restritivo)
    """
    
    def __init__(self, app, max_attempts: int = 5):
        super().__init__(app)
        self.max_attempts = max_attempts
        self.attempts: Dict[str, list] = {}
        
    async def dispatch(self, request: Request, call_next):
        # Apenas para /login
        if request.url.path != "/api/auth/login":
            return await call_next(request)
        
        # Get IP
        ip = request.client.host if request.client else 'unknown'
        
        # Get current time
        now = time.time()
        
        # Clean old attempts (older than 5 minutes)
        if ip in self.attempts:
            self.attempts[ip] = [
                attempt_time for attempt_time in self.attempts[ip]
                if now - attempt_time < 300  # 5 minutes
            ]
        else:
            self.attempts[ip] = []
        
        # Check limit
        if len(self.attempts[ip]) >= self.max_attempts:
            raise HTTPException(
                status_code=429,
                detail="Too many login attempts. Please try again in 5 minutes."
            )
        
        # Add current attempt
        self.attempts[ip].append(now)
        
        # Process request
        response = await call_next(request)
        
        return response
