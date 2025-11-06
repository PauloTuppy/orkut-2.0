"""
Cerebras LLM Service
"""
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class CerebrasService:
    """Cerebras LLM Service for Gist Memory and AI"""
    
    def __init__(self, api_key: str, model: str = "llama-3.3-70b"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.cerebras.ai/v1"
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self):
        """Initialize async client"""
        if not self.api_key:
            logger.warning("⚠️  Cerebras API key not configured")
            return
        
        self.client = httpx.AsyncClient(
            headers={"Authorization": f"Bearer {self.api_key}"},
            base_url=self.base_url,
            timeout=30.0
        )
        logger.info("✅ Cerebras client initialized")
    
    async def close(self):
        """Close client"""
        if self.client:
            await self.client.aclose()
    
    async def complete(self, prompt: str, max_tokens: int = 500) -> str:
        """Complete text with LLM"""
        if not self.client:
            await self.initialize()
        
        if not self.client:
            return "Cerebras not configured"
        
        try:
            response = await self.client.post(
                "/chat/completions",
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                    "temperature": 0.7
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"❌ Cerebras error: {e}")
            return f"Error: {str(e)}"
    
    async def gist_memory(self, document: str) -> dict:
        """Summarize document with Gist Memory"""
        # Split document into pages
        paragraphs = document.split("\n\n")
        pages = []
        gists = []
        current_page = []
        current_words = 0
        
        for para in paragraphs:
            words = len(para.split())
            current_words += words
            current_page.append(para)
            
            if current_words > 500:  # ~500 words per page
                pages.append("\n\n".join(current_page))
                current_page = []
                current_words = 0
        
        if current_page:
            pages.append("\n\n".join(current_page))
        
        # Generate gist for each page
        logger.info(f"📄 Creating gists for {len(pages)} pages...")
        
        for i, page in enumerate(pages):
            try:
                gist = await self.complete(
                    f"Resuma este texto em 1-2 frases:\n\n{page[:500]}...",
                    max_tokens=100
                )
                gists.append(gist)
                logger.info(f"✅ Gist {i+1}/{len(pages)} created")
            except Exception as e:
                logger.error(f"❌ Failed to create gist {i+1}: {e}")
                gists.append("Erro ao gerar resumo")
        
        return {
            "total_pages": len(pages),
            "pages": pages,
            "gists": gists
        }
    
    async def answer_question(self, context: str, question: str) -> str:
        """Answer question about context"""
        prompt = f"""Responda a pergunta baseado no contexto fornecido.

Contexto:
{context}

Pergunta:
{question}

Resposta:"""
        
        return await self.complete(prompt)


# Global instance (will be initialized in main.py)
cerebras_service: Optional[CerebrasService] = None
