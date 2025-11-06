from fastapi import FastAPI, WebSocketException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.cache import cache
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Orkut 2.0 API starting...")
    logger.info(f"Cache enabled: {cache.enabled}")
    logger.info(f"Redis/KeyDB URL: {cache.redis_url}")
    yield
    logger.info("🛑 Orkut 2.0 API stopping...")

app = FastAPI(
    title="Orkut 2.0 API",
    description="Communities + Chat + RSS with Gemini IA",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "cache": "keydb" if cache.enabled else "disabled",
        "database": "postgresql"
    }

# Import routes
from app.routes import auth, communities, messages, feeds
from app.api import agents

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(communities.router, prefix="/api", tags=["communities"])
app.include_router(messages.router, prefix="/api", tags=["messages"])
app.include_router(feeds.router, prefix="/api", tags=["feeds"])
app.include_router(agents.router, prefix="/api", tags=["agents"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)