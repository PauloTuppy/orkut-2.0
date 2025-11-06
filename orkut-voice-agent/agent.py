# agent.py
import os
import logging
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions
from livekit.plugins import openai, silero, cartesia

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Keys
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

logger.info("🚀 Orkut 2.0 Voice Agent Starting...")
logger.info(f"📡 LiveKit URL: {LIVEKIT_URL}")
logger.info(f"🤖 Cerebras Model: llama-3.3-70b")
logger.info(f"🎤 Cartesia Voice: ink-whisper")


def load_context(context_file: str) -> str:
    """Load context from markdown files"""
    try:
        with open(context_file, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        logger.warning(f"Context file not found: {context_file}")
        return "No context available"


class SalesAgent(Agent):
    """Sales agent com Cerebras + Cartesia"""

    def __init__(self):
        # Load context
        context = load_context("context/sales.md")

        # LLM (Cerebras via OpenAI API)
        llm = openai.LLM.with_cerebras(model="llama-3.3-70b")

        # STT (Cartesia)
        stt = cartesia.STT()

        # TTS (Cartesia)
        tts = cartesia.TTS(voice="ink-whisper")

        # VAD (Voice Activity Detection)
        vad = silero.VAD.load()

        system_prompt = f"""You are a sales agent for Orkut 2.0, a social network combining:
- Orkut (communities, profiles, depoimentos)
- MSN Messenger (real-time chat, contacts)
- RSS Reader (document analysis with Gist Memory)
- Clubhouse (audio rooms for conversations)
- Napster (P2P file sharing)

You communicate by voice. All responses will be spoken aloud.

CONTEXT:
{context}

RULES:
- ONLY use information from the context
- If asked about something not in context, say "I don't have that information"
- Be conversational and friendly
- Recommend features based on user interests
- Quote directly from context when possible"""

        super().__init__(
            instructions=system_prompt,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=vad
        )
        logger.info("✅ SalesAgent initialized")

    async def on_enter(self):
        """Greet user on entry"""
        await self.session.say(
            "Olá! Bem-vindo ao Orkut 2.0. "
            "Sou o agente de vendas. Como posso ajudar você hoje?"
        )


class TechnicalAgent(Agent):
    """Technical support agent"""

    def __init__(self):
        context = load_context("context/technical.md")

        llm = openai.LLM.with_cerebras(model="llama-3.3-70b")
        stt = cartesia.STT()
        tts = cartesia.TTS(voice="bf0a246a-8642-498a-9950-80c35e9276b5")
        vad = silero.VAD.load()

        system_prompt = f"""You are a technical support specialist for Orkut 2.0.

CONTEXT:
{context}

Focus on:
- Technical specifications
- How to use features
- Troubleshooting
- Integration details

RULES:
- Only use provided context
- Explain clearly for non-technical users
- Avoid jargon when possible"""

        super().__init__(
            instructions=system_prompt,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=vad
        )
        logger.info("✅ TechnicalAgent initialized")

    async def on_enter(self):
        await self.session.say(
            "Olá, sou o especialista técnico. "
            "Posso ajudar com dúvidas técnicas sobre Orkut 2.0."
        )


class PricingAgent(Agent):
    """Pricing specialist agent"""

    def __init__(self):
        context = load_context("context/pricing.md")

        llm = openai.LLM.with_cerebras(model="llama-3.3-70b")
        stt = cartesia.STT()
        tts = cartesia.TTS(voice="4df027cb-2920-4a1f-8c34-f21529d5c3fe")
        vad = silero.VAD.load()

        system_prompt = f"""You are a pricing specialist for Orkut 2.0.

CONTEXT:
{context}

Focus on:
- Pricing tiers
- Free vs premium features
- ROI and value
- Special offers

RULES:
- Only quote prices from context
- Help users find best value
- Never make up discounts"""

        super().__init__(
            instructions=system_prompt,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=vad
        )
        logger.info("✅ PricingAgent initialized")

    async def on_enter(self):
        await self.session.say(
            "Olá, sou o especialista em preços. "
            "Posso ajudar você a encontrar o melhor plano!"
        )


async def agent_entrypoint(ctx: JobContext):
    """Main entry point for agent sessions"""
    logger.info(f"🎯 New session started: {ctx.room.name}")
    await ctx.connect()

    # Start with sales agent
    session = AgentSession()
    await session.start(
        agent=SalesAgent(),
        room=ctx.room
    )

    logger.info(f"✅ Session completed: {ctx.room.name}")


# Worker options
worker_options = WorkerOptions(
    entrypoint_fnc=agent_entrypoint,
    num_workers=2,  # Number of concurrent workers
)

if __name__ == "__main__":
    logger.info("🟢 Starting LiveKit Agent")
    agents.run(worker_options)
