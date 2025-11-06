"""
LiveKit Voice Agent API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Literal
import os
from livekit import api
from datetime import datetime, timedelta

router = APIRouter(prefix="/agents", tags=["agents"])

# LiveKit configuration
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://orkut-2-0-xxxxx.livekit.cloud")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "devkey")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "secret")


class TokenRequest(BaseModel):
    agentType: Literal["sales", "technical", "pricing"]
    username: str = "guest"


class TokenResponse(BaseModel):
    token: str
    room: str
    url: str


@router.post("/token", response_model=TokenResponse)
async def get_agent_token(request: TokenRequest):
    """
    Generate LiveKit token for voice agent connection
    """
    try:
        # Create unique room name
        room_name = f"{request.agentType}-{request.username}-{datetime.now().timestamp()}"
        
        # Generate token
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        token.with_identity(request.username)
        token.with_name(request.username)
        token.with_grants(
            api.VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            )
        )
        
        # Token expires in 1 hour
        token.with_ttl(timedelta(hours=1))
        
        jwt_token = token.to_jwt()
        
        return TokenResponse(
            token=jwt_token,
            room=room_name,
            url=LIVEKIT_URL
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate token: {str(e)}"
        )


@router.get("/status")
async def get_agent_status():
    """
    Check if voice agents are available
    """
    return {
        "status": "online",
        "agents": ["sales", "technical", "pricing"],
        "livekit_url": LIVEKIT_URL
    }
