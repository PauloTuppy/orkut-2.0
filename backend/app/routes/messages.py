"""
Messages routes
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/messages")
async def get_messages(community_id: str = None):
    """Get messages"""
    return []


@router.post("/messages")
async def send_message():
    """Send message"""
    return {"id": "1", "content": "Message sent"}
