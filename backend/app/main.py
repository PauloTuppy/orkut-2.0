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
# CORS (Configuração Completa - ANTES das rotas!)
# ============================================================
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://192.168.3.13:3000",  # IP local da rede
    "http://192.168.3.13:5173",
]

logger.info(f"✅ CORS Origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # ✅ Whitelist explícita com IP local
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Todos os métodos (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],  # ✅ Todos os headers
    max_age=600,  # Cache preflight por 10 minutos
    expose_headers=["*"]
)

# ============================================================
# Rate Limiting
# ============================================================
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
app.add_middleware(LoginRateLimitMiddleware, max_attempts=5)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Initializing Orkut 2.0 API services...")
    
    # Initialize Cerebras
    try:
        from app.config import settings
        from app.services import cerebras_service as cs_module
        
        if settings.CEREBRAS_API_KEY:
            cs_module.cerebras_service = cs_module.CerebrasService(
                api_key=settings.CEREBRAS_API_KEY,
                model=settings.CEREBRAS_MODEL
            )
            await cs_module.cerebras_service.initialize()
        else:
            logger.warning("⚠️  Cerebras API key not configured")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Cerebras: {e}")
    
    logger.info("✅ Services initialization complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Close services on shutdown"""
    logger.info("🛑 Shutting down API...")
    
    try:
        from app.services import cerebras_service as cs_module
        if cs_module.cerebras_service:
            await cs_module.cerebras_service.close()
    except:
        pass

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "cache": "keydb" if cache.enabled else "disabled",
        "database": "postgresql"
    }

@app.get("/test-cors")
async def test_cors():
    """Test CORS configuration"""
    logger.info("📍 CORS test called")
    return {
        "status": "CORS OK ✅",
        "message": "CORS is working correctly",
        "allowed_origins": ALLOWED_ORIGINS
    }

@app.options("/{full_path:path}")
async def preflight(full_path: str):
    """Handle OPTIONS (preflight) requests"""
    logger.debug(f"📍 OPTIONS preflight for: {full_path}")
    return {
        "message": "OK"
    }

# Import routes
try:
    from app.routes import auth, communities, messages, feeds
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(communities.router, prefix="/api/communities", tags=["communities"])
    app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
    app.include_router(feeds.router, prefix="/api/feeds", tags=["feeds"])
except ImportError as e:
    logger.warning(f"Could not import routes: {e}")

# Import AI routes
try:
    from app.api import ai
    app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
    logger.info("✅ AI routes loaded")
except ImportError as e:
    logger.warning(f"Could not import AI routes: {e}")

# Try to import agents (optional)
try:
    from app.api import agents
    app.include_router(agents.router, prefix="/api", tags=["agents"])
except ImportError as e:
    logger.warning(f"Could not import agents: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)