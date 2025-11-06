"""
Feeds routes
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/feeds")
async def get_feeds():
    """Get all feeds"""
    return []


@router.post("/feeds")
async def create_feed():
    """Create feed"""
    return {"id": "1", "url": "https://example.com/feed"}


@router.delete("/feeds/{feed_id}")
async def delete_feed(feed_id: str):
    """Delete feed"""
    return {"message": "Feed deleted"}
