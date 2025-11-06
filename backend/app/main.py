from fastapi import FastAPI, WebSocketException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.cache import cache
from app.middleware.rate_limit import RateLimitMiddleware, LoginRateLimitMiddleware
import logging
import os

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

# ============================================================
# CORS (Seguro - Whitelist explícita)
# ============================================================
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# Remove espaços
allowed_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # ✅ Whitelist explícita
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # ✅ Métodos específicos
    allow_headers=["Content-Type", "Authorization"],  # ✅ Headers específicos
    max_age=3600  # Cache preflight por 1 hora
)

# ============================================================
# Rate Limiting
# ============================================================
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
app.add_middleware(LoginRateLimitMiddleware, max_attempts=5)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "cache": "keydb" if cache.enabled else "disabled",
        "database": "postgresql"
    }

# Import routes
try:
    from app.routes import auth, communities, messages, feeds
    app.include_router(auth.router, prefix="/api", tags=["auth"])
    app.include_router(communities.router, prefix="/api", tags=["communities"])
    app.include_router(messages.router, prefix="/api", tags=["messages"])
    app.include_router(feeds.router, prefix="/api", tags=["feeds"])
except ImportError as e:
    logger.warning(f"Could not import routes: {e}")

# Try to import agents (optional)
try:
    from app.api import agents
    app.include_router(agents.router, prefix="/api", tags=["agents"])
except ImportError as e:
    logger.warning(f"Could not import agents: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)