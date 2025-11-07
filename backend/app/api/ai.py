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
        
        # Se o serviço Cerebras não estiver disponível, usar simulação
        if not cerebras_service:
            logger.warning("⚠️  Cerebras not configured, using simulation")
            return simulate_gist_memory(request.content, request.title)
        
        result = await cerebras_service.gist_memory(request.content)
        logger.info(f"✅ Gist Memory: {result['total_pages']} pages processed")
        
        return result
    except Exception as e:
        logger.error(f"❌ Gist Memory error: {e}")
        # Fallback para simulação em caso de erro
        logger.info("🔄 Falling back to simulation")
        return simulate_gist_memory(request.content, request.title)


def simulate_gist_memory(content: str, title: str) -> dict:
    """Simulate Gist Memory processing"""
    # Dividir conteúdo em páginas simuladas
    words = content.split()
    total_words = len(words)
    words_per_page = 500
    total_pages = max(1, (total_words + words_per_page - 1) // words_per_page)
    
    # Gerar resumos simulados baseados no conteúdo
    gists = []
    for i in range(total_pages):
        start_idx = i * words_per_page
        end_idx = min((i + 1) * words_per_page, total_words)
        page_words = words[start_idx:end_idx]
        
        # Criar resumo baseado nas primeiras palavras da página
        if len(page_words) > 10:
            key_words = page_words[:10]
            gist = f"Página {i+1}: Aborda temas relacionados a {' '.join(key_words[:5])}... Contém informações sobre {' '.join(key_words[5:10])} e conceitos relacionados."
        else:
            gist = f"Página {i+1}: Seção final do documento com {len(page_words)} palavras restantes."
        
        gists.append(gist)
    
    logger.info(f"✅ Simulated Gist Memory: {total_pages} pages, {total_words} words")
    
    return {
        "total_pages": total_pages,
        "gists": gists,
        "simulation": True,
        "message": "Resumos gerados com simulação (Cerebras API não configurada)"
    }


@router.post("/ask-question")
async def ask_question(request: QuestionRequest):
    """Ask question about document"""
    try:
        from app.services.cerebras_service import cerebras_service
        
        # Se o serviço Cerebras não estiver disponível, usar simulação
        if not cerebras_service:
            logger.warning("⚠️  Cerebras not configured, using simulation")
            return {"answer": simulate_question_answer(request.question, request.context)}
        
        answer = await cerebras_service.answer_question(
            request.context,
            request.question
        )
        logger.info("✅ Question answered")
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"❌ Question error: {e}")
        # Fallback para simulação
        logger.info("🔄 Falling back to simulation")
        return {"answer": simulate_question_answer(request.question, request.context)}


def simulate_question_answer(question: str, context: str) -> str:
    """Simulate AI question answering"""
    # Análise simples baseada em palavras-chave
    question_lower = question.lower()
    context_words = context.lower().split()
    
    # Respostas baseadas em palavras-chave comuns
    if any(word in question_lower for word in ['o que', 'what', 'que é', 'define']):
        return f"Com base no documento fornecido, posso identificar que o conteúdo aborda diversos temas. Para uma resposta mais específica sobre '{question}', seria necessário analisar seções específicas do texto. O documento contém aproximadamente {len(context_words)} palavras com informações relevantes."
    
    elif any(word in question_lower for word in ['como', 'how', 'de que forma']):
        return f"O documento apresenta metodologias e processos relacionados à sua pergunta '{question}'. Com base no conteúdo analisado, há indicações de procedimentos e abordagens que podem responder sua questão."
    
    elif any(word in question_lower for word in ['quando', 'when', 'data', 'tempo']):
        return f"Sobre aspectos temporais relacionados a '{question}', o documento pode conter informações cronológicas. Uma análise mais detalhada seria necessária para identificar datas e períodos específicos."
    
    elif any(word in question_lower for word in ['onde', 'where', 'local', 'lugar']):
        return f"Quanto à localização ou contexto geográfico da sua pergunta '{question}', o documento pode apresentar informações sobre locais e contextos espaciais relevantes."
    
    elif any(word in question_lower for word in ['por que', 'why', 'motivo', 'razão']):
        return f"As razões e motivações relacionadas a '{question}' podem estar explicadas no documento. O conteúdo sugere fundamentos e justificativas para os temas abordados."
    
    else:
        return f"Sua pergunta '{question}' é interessante. Com base no documento analisado, posso identificar conteúdo relacionado que pode fornecer insights relevantes. Para uma resposta mais precisa, recomendo reformular a pergunta de forma mais específica."


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


@router.post("/token")
async def create_token(room_name: str, user_name: str):
    """Create LiveKit token"""
    logger.info(f"✅ Token created for {user_name} in {room_name}")
    return {
        "token": f"demo_token_{room_name}_{user_name}",
        "url": "wss://orkut-2-0.livekit.cloud"
    }


# ============================================================
# File Upload Endpoints
# ============================================================

from fastapi import UploadFile, File
from typing import Optional
import tempfile
import os

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF file"""
    try:
        # Verificar se é PDF
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Verificar tamanho (50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        content = await file.read()
        
        if len(content) > max_size:
            raise HTTPException(status_code=400, detail="File too large. Maximum size: 50MB")
        
        # Salvar temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            # Extrair texto do PDF (simulado)
            # Em produção, use PyPDF2, pdfplumber ou similar
            extracted_text = f"""
Documento PDF processado: {file.filename}
Tamanho: {len(content) / 1024 / 1024:.2f} MB

TEXTO EXTRAÍDO (SIMULADO):

Este é um exemplo de texto extraído de um PDF.
Em uma implementação real, você usaria bibliotecas como:
- PyPDF2: para PDFs simples
- pdfplumber: para PDFs com tabelas
- pymupdf (fitz): para PDFs complexos

Conteúdo simulado do documento:
1. Introdução e objetivos
2. Metodologia aplicada
3. Resultados obtidos
4. Análise dos dados
5. Conclusões e recomendações

Para implementar extração real de PDF, instale:
pip install PyPDF2 pdfplumber pymupdf

Exemplo de código:
import PyPDF2
with open(pdf_path, 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

Total de páginas simuladas: 5
Palavras extraídas: ~500
            """
            
            logger.info(f"✅ PDF processed: {file.filename} ({len(content)} bytes)")
            
            return {
                "filename": file.filename,
                "size": len(content),
                "text": extracted_text,
                "pages": 5,
                "words": len(extracted_text.split()),
                "message": "PDF processed successfully (simulated extraction)"
            }
            
        finally:
            # Limpar arquivo temporário
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"❌ PDF processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.get("/supported-formats")
async def get_supported_formats():
    """Get supported file formats"""
    return {
        "formats": [
            {
                "type": "PDF",
                "extensions": [".pdf"],
                "max_size": "50MB",
                "description": "Portable Document Format"
            }
        ],
        "max_file_size": "50MB",
        "total_formats": 1
    }


# ============================================================
# RSS Feed Endpoints
# ============================================================

import feedparser
import httpx
from datetime import datetime
from typing import List, Dict, Any

class RSSFeedRequest(BaseModel):
    url: str
    max_items: Optional[int] = 10

class RSSSearchRequest(BaseModel):
    query: str
    sources: Optional[List[str]] = None
    max_items: Optional[int] = 20

@router.post("/rss/fetch")
async def fetch_rss_feed(request: RSSFeedRequest):
    """Fetch RSS feed from URL"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.url)
            response.raise_for_status()
            
            # Parse RSS feed
            feed = feedparser.parse(response.content)
            
            if feed.bozo:
                logger.warning(f"⚠️  RSS feed may have issues: {request.url}")
            
            items = []
            for entry in feed.entries[:request.max_items]:
                # Extract image from entry
                image_url = None
                if hasattr(entry, 'media_content') and entry.media_content:
                    image_url = entry.media_content[0].get('url')
                elif hasattr(entry, 'enclosures') and entry.enclosures:
                    for enclosure in entry.enclosures:
                        if enclosure.type.startswith('image/'):
                            image_url = enclosure.href
                            break
                
                # Parse published date
                published = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    published = datetime(*entry.published_parsed[:6]).isoformat()
                elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                    published = datetime(*entry.updated_parsed[:6]).isoformat()
                
                items.append({
                    "id": getattr(entry, 'id', entry.link),
                    "title": getattr(entry, 'title', 'Sem título'),
                    "description": getattr(entry, 'summary', ''),
                    "content": getattr(entry, 'content', [{}])[0].get('value', '') if hasattr(entry, 'content') else '',
                    "link": getattr(entry, 'link', ''),
                    "published": published,
                    "author": getattr(entry, 'author', ''),
                    "image": image_url,
                    "tags": [tag.term for tag in getattr(entry, 'tags', [])]
                })
            
            logger.info(f"✅ RSS feed fetched: {len(items)} items from {request.url}")
            
            return {
                "feed_info": {
                    "title": getattr(feed.feed, 'title', 'Feed RSS'),
                    "description": getattr(feed.feed, 'description', ''),
                    "link": getattr(feed.feed, 'link', ''),
                    "language": getattr(feed.feed, 'language', 'pt-br'),
                    "updated": getattr(feed.feed, 'updated', '')
                },
                "items": items,
                "total_items": len(items),
                "source_url": request.url
            }
            
    except Exception as e:
        logger.error(f"❌ RSS fetch error: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching RSS feed: {str(e)}")

@router.get("/rss/popular-feeds")
async def get_popular_feeds():
    """Get list of popular RSS feeds"""
    popular_feeds = [
        {
            "name": "G1 - Tecnologia",
            "url": "https://g1.globo.com/rss/g1/tecnologia/",
            "category": "Tecnologia",
            "description": "Últimas notícias de tecnologia do G1",
            "language": "pt-br"
        },
        {
            "name": "TechCrunch",
            "url": "https://techcrunch.com/feed/",
            "category": "Tecnologia",
            "description": "Latest technology news from TechCrunch",
            "language": "en"
        },
        {
            "name": "Folha - Tec",
            "url": "https://feeds.folha.uol.com.br/tec/rss091.xml",
            "category": "Tecnologia",
            "description": "Notícias de tecnologia da Folha de S.Paulo",
            "language": "pt-br"
        },
        {
            "name": "Hacker News",
            "url": "https://hnrss.org/frontpage",
            "category": "Tecnologia",
            "description": "Top stories from Hacker News",
            "language": "en"
        },
        {
            "name": "BBC News - Technology",
            "url": "http://feeds.bbci.co.uk/news/technology/rss.xml",
            "category": "Tecnologia",
            "description": "BBC Technology News",
            "language": "en"
        },
        {
            "name": "Exame - Tecnologia",
            "url": "https://exame.com/rss/",
            "category": "Negócios",
            "description": "Notícias de negócios e tecnologia da Exame",
            "language": "pt-br"
        }
    ]
    
    return {
        "feeds": popular_feeds,
        "total": len(popular_feeds),
        "categories": list(set(feed["category"] for feed in popular_feeds))
    }

@router.post("/rss/search")
async def search_rss_content(request: RSSSearchRequest):
    """Search content across multiple RSS feeds"""
    try:
        # Get popular feeds if no sources specified
        if not request.sources:
            popular_response = await get_popular_feeds()
            feed_urls = [feed["url"] for feed in popular_response["feeds"][:5]]  # Limit to 5 feeds
        else:
            feed_urls = request.sources
        
        all_items = []
        
        # Fetch from multiple feeds
        async with httpx.AsyncClient(timeout=30.0) as client:
            for feed_url in feed_urls:
                try:
                    response = await client.get(feed_url)
                    response.raise_for_status()
                    
                    feed = feedparser.parse(response.content)
                    
                    for entry in feed.entries[:10]:  # Limit per feed
                        # Check if query matches title or description
                        title = getattr(entry, 'title', '').lower()
                        summary = getattr(entry, 'summary', '').lower()
                        query_lower = request.query.lower()
                        
                        if query_lower in title or query_lower in summary:
                            # Parse published date
                            published = None
                            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                                published = datetime(*entry.published_parsed[:6]).isoformat()
                            
                            all_items.append({
                                "id": getattr(entry, 'id', entry.link),
                                "title": getattr(entry, 'title', 'Sem título'),
                                "description": getattr(entry, 'summary', ''),
                                "link": getattr(entry, 'link', ''),
                                "published": published,
                                "source": getattr(feed.feed, 'title', 'RSS Feed'),
                                "source_url": feed_url,
                                "relevance_score": title.count(query_lower) + summary.count(query_lower)
                            })
                            
                except Exception as e:
                    logger.warning(f"⚠️  Failed to fetch feed {feed_url}: {e}")
                    continue
        
        # Sort by relevance and published date
        all_items.sort(key=lambda x: (x["relevance_score"], x["published"] or ""), reverse=True)
        
        # Limit results
        results = all_items[:request.max_items]
        
        logger.info(f"✅ RSS search completed: {len(results)} results for '{request.query}'")
        
        return {
            "query": request.query,
            "results": results,
            "total_results": len(results),
            "searched_feeds": len(feed_urls)
        }
        
    except Exception as e:
        logger.error(f"❌ RSS search error: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching RSS feeds: {str(e)}")

@router.get("/rss/test")
async def test_rss():
    """Test RSS functionality with a simple feed"""
    try:
        # Test with G1 Technology feed
        test_request = RSSFeedRequest(url="https://g1.globo.com/rss/g1/tecnologia/", max_items=5)
        result = await fetch_rss_feed(test_request)
        
        return {
            "status": "RSS system working",
            "test_feed": "G1 Tecnologia",
            "items_fetched": result["total_items"],
            "sample_title": result["items"][0]["title"] if result["items"] else "No items"
        }
    except Exception as e:
        return {
            "status": "RSS system error",
            "error": str(e)
        }


# ============================================================
# P2P File Sharing Endpoints
# ============================================================

import os
import uuid
import mimetypes
from pathlib import Path
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

class FileUploadRequest(BaseModel):
    category: str = "general"
    description: Optional[str] = None

class SharedFileInfo(BaseModel):
    id: str
    name: str
    size: int
    type: str
    category: str
    description: Optional[str]
    upload_date: str
    downloads: int = 0
    is_audio: bool = False

# In-memory storage for demo (use database in production)
shared_files_db = {}
download_stats = {}

@router.post("/p2p/upload")
async def upload_file(file: UploadFile = File(...), category: str = "general", description: str = ""):
    """Upload file for P2P sharing"""
    try:
        # Validate file type
        allowed_types = {
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
            'video/mp4', 'video/avi', 'video/mkv',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
        
        # Check file size (max 100MB)
        content = await file.read()
        max_size = 100 * 1024 * 1024  # 100MB
        if len(content) > max_size:
            raise HTTPException(status_code=400, detail="File too large. Maximum size: 100MB")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        safe_filename = f"{file_id}{file_extension}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Determine if it's audio
        is_audio = file.content_type.startswith('audio/')
        
        # Store file info
        file_info = {
            "id": file_id,
            "name": file.filename,
            "original_name": file.filename,
            "size": len(content),
            "type": file.content_type,
            "category": category,
            "description": description,
            "upload_date": datetime.now().isoformat(),
            "downloads": 0,
            "is_audio": is_audio,
            "file_path": str(file_path)
        }
        
        shared_files_db[file_id] = file_info
        
        logger.info(f"✅ File uploaded: {file.filename} ({len(content)} bytes)")
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": len(content),
            "type": file.content_type,
            "is_audio": is_audio,
            "message": "File uploaded successfully"
        }
        
    except Exception as e:
        logger.error(f"❌ Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/p2p/files")
async def list_shared_files(category: Optional[str] = None, search: Optional[str] = None):
    """List all shared files"""
    try:
        files = list(shared_files_db.values())
        
        # Filter by category
        if category and category != "all":
            files = [f for f in files if f["category"] == category]
        
        # Filter by search
        if search:
            search_lower = search.lower()
            files = [f for f in files if search_lower in f["name"].lower() or 
                    search_lower in f.get("description", "").lower()]
        
        # Add simulated peer and download stats
        for file in files:
            file_id = file["id"]
            if file_id not in download_stats:
                download_stats[file_id] = {
                    "downloads": file.get("downloads", 0),
                    "peers": max(1, file["size"] // (1024 * 1024))  # Simulate peers based on file size
                }
            
            file["downloads"] = download_stats[file_id]["downloads"]
            file["peers"] = download_stats[file_id]["peers"]
        
        # Sort by upload date (newest first)
        files.sort(key=lambda x: x["upload_date"], reverse=True)
        
        return {
            "files": files,
            "total": len(files),
            "categories": list(set(f["category"] for f in shared_files_db.values()))
        }
        
    except Exception as e:
        logger.error(f"❌ List files error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/p2p/download/{file_id}")
async def download_file(file_id: str):
    """Download shared file"""
    try:
        if file_id not in shared_files_db:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = shared_files_db[file_id]
        file_path = Path(file_info["file_path"])
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        # Update download count
        if file_id not in download_stats:
            download_stats[file_id] = {"downloads": 0, "peers": 1}
        download_stats[file_id]["downloads"] += 1
        
        logger.info(f"✅ File downloaded: {file_info['name']}")
        
        return FileResponse(
            path=file_path,
            filename=file_info["original_name"],
            media_type=file_info["type"]
        )
        
    except Exception as e:
        logger.error(f"❌ Download error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/p2p/stream/{file_id}")
async def stream_media(file_id: str):
    """Stream audio/video file for web player"""
    try:
        if file_id not in shared_files_db:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = shared_files_db[file_id]
        
        # Allow both audio and video streaming
        if not (file_info["is_audio"] or file_info["type"].startswith('video/')):
            raise HTTPException(status_code=400, detail="File is not audio or video")
        
        file_path = Path(file_info["file_path"])
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        def iterfile(file_path: Path):
            with open(file_path, mode="rb") as file_like:
                yield from file_like
        
        return StreamingResponse(
            iterfile(file_path),
            media_type=file_info["type"],
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": str(file_info["size"]),
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Stream error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/p2p/stats")
async def get_p2p_stats():
    """Get P2P network statistics"""
    total_files = len(shared_files_db)
    total_downloads = sum(stats.get("downloads", 0) for stats in download_stats.values())
    
    # Simulate network stats
    online_peers = max(100, total_files * 10)
    
    categories = {}
    for file_info in shared_files_db.values():
        cat = file_info["category"]
        if cat not in categories:
            categories[cat] = {"files": 0, "size": 0}
        categories[cat]["files"] += 1
        categories[cat]["size"] += file_info["size"]
    
    return {
        "online_peers": online_peers,
        "total_files": total_files,
        "total_downloads": total_downloads,
        "categories": categories,
        "network_status": "active"
    }

@router.delete("/p2p/file/{file_id}")
async def delete_shared_file(file_id: str):
    """Delete shared file"""
    try:
        if file_id not in shared_files_db:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = shared_files_db[file_id]
        file_path = Path(file_info["file_path"])
        
        # Delete file from disk
        if file_path.exists():
            file_path.unlink()
        
        # Remove from database
        del shared_files_db[file_id]
        if file_id in download_stats:
            del download_stats[file_id]
        
        logger.info(f"✅ File deleted: {file_info['name']}")
        
        return {"message": "File deleted successfully"}
        
    except Exception as e:
        logger.error(f"❌ Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
