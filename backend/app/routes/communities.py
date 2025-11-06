"""
Communities routes
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/communities")
async def get_communities():
    """Get all communities"""
    return []


@router.get("/communities/{community_id}")
async def get_community(community_id: str):
    """Get community by ID"""
    return {"id": community_id, "name": "Demo Community"}


@router.post("/communities")
async def create_community():
    """Create community"""
    return {"id": "1", "name": "New Community"}


@router.post("/communities/{community_id}/join")
async def join_community(community_id: str):
    """Join community"""
    return {"message": "Joined successfully"}


@router.post("/communities/{community_id}/leave")
async def leave_community(community_id: str):
    """Leave community"""
    return {"message": "Left successfully"}
