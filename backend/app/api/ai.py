"""
AI API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class DocumentRequest(BaseModel):
    content: str
    title: str


class QuestionRequest(BaseModel):
    question: str
    context: str


# ============================================================
# Gist Memory Endpoints
# ============================================================

@router.post("/gist-memory")
async def process_document_gist(request: DocumentRequest):
    """Process document with Gist Memory"""
    try:
        from app.services.cerebras_service import cerebras_service
        
        if not cerebras_service:
            raise HTTPException(status_code=503, detail="Cerebras service not available")
        
        result = await cerebras_service.gist_memory(request.content)
        logger.info(f"✅ Gist Memory: {result['total_pages']} pages processed")
        
        return result
    except Exception as e:
        logger.error(f"❌ Gist Memory error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask-question")
async def ask_question(request: QuestionRequest):
    """Ask question about document"""
    try:
        from app.services.cerebras_service import cerebras_service
        
        if not cerebras_service:
            raise HTTPException(status_code=503, detail="Cerebras service not available")
        
        answer = await cerebras_service.answer_question(
            request.context,
            request.question
        )
        logger.info("✅ Question answered")
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"❌ Question error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Voice Endpoints (Placeholder)
# ============================================================

@router.post("/text-to-speech")
async def text_to_speech(text: str):
    """Convert text to speech"""
    logger.info(f"✅ TTS requested for: {text[:50]}...")
    return {
        "audio_url": "/audio/stream",
        "size": 1024,
        "message": "TTS endpoint ready (Cartesia integration pending)"
    }


@router.get("/voices")
async def get_voices():
    """Get available voices"""
    logger.info("✅ Voices listed")
    return {
        "voices": [
            {"id": "ink-whisper", "name": "Ink Whisper", "language": "en-US"},
            {"id": "professional", "name": "Professional", "language": "en-US"}
        ]
    }


# ============================================================
# LiveKit Endpoints (Placeholder)
# ============================================================

@router.get("/rooms")
async def list_rooms():
    """List active rooms"""
    logger.info("✅ Rooms listed")
    return {
        "rooms": [
            {"name": "Desenvolvimento", "participants": 5, "active": True},
            {"name": "Games", "participants": 3, "active": True},
            {"name": "Música", "participants": 2, "active": False}
        ]
    }


@router.post("/rooms")
async def create_room(room_name: str):
    """Create LiveKit room"""
    logger.info(f"✅ Room created: {room_name}")
    return {
        "room_name": room_name,
        "status": "created",
        "url": "wss://orkut-2-0.livekit.cloud"
    }
