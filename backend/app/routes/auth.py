"""
Authentication routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint
    Demo credentials: demo@orkut.com / demo123
    """
    # Demo authentication
    if credentials.email == "demo@orkut.com" and credentials.password == "demo123":
        return TokenResponse(
            access_token="demo-token-12345",
            token_type="bearer"
        )
    
    raise HTTPException(status_code=401, detail="Email ou senha inválidos")


@router.post("/auth/register", response_model=TokenResponse)
async def register(user: RegisterRequest):
    """
    Register endpoint
    """
    # Demo registration - always succeeds
    return TokenResponse(
        access_token="demo-token-12345",
        token_type="bearer"
    )


@router.get("/auth/me")
async def get_current_user():
    """
    Get current user
    """
    return {
        "id": "1",
        "name": "Demo User",
        "email": "demo@orkut.com"
    }


@router.post("/auth/logout")
async def logout():
    """
    Logout endpoint
    """
    return {"message": "Logged out successfully"}
