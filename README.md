# 🚀 Orkut 2.0

Modern social network inspired by classic Orkut, built with cutting-edge technologies and ready to scale.

**Status:** 🟢 ONLINE | **Version:** 2.0.0 | **Last Update:** Nov 2025

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT with bcrypt hashing
- 👥 **Communities** - Create and join communities
- 💬 **MSN-Style Chat** - Real-time messaging with Windows XP design
- 📝 **Posts & Comments** - Social feed with interactions
- 🎨 **Orkut Profile** - Classic profile with testimonials

### AI-Powered Features
- 🧠 **Gist Memory** - AI document analysis with PDF upload (NEW!)
- 🤖 **Smart Summaries** - Automatic document summarization
- 💬 **Q&A System** - Ask questions about your documents
- 🎤 **Voice AI Agents** - LiveKit + Cartesia voice chat
- 📊 **Document Analysis** - Word count, topics, complexity

### Modern Features
- 📰 **RSS Feed Reader** - Aggregate news from multiple sources
- 🎙️ **Audio Rooms** - Clubhouse-style voice rooms
- 📁 **P2P File Sharing** - Napster-style file sharing with streaming
- ⚡ **Smart Caching** - KeyDB for ultra-fast responses
- 🔒 **Enterprise Security** - Rate limiting, input validation, CORS

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern and fast web framework
- **PostgreSQL** - Relational database
- **KeyDB** - Redis-compatible multithreaded cache
- **SQLAlchemy** - Python ORM
- **Alembic** - Database migrations
- **Gemini API** - Google AI
- **LiveKit** - Real-time voice/video platform

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Zustand** - State management
- **Socket.io** - Real-time communication
- **LiveKit React** - Voice agent integration

### AI/ML
- **Cerebras** - Ultra-fast LLM inference (LLaMA 3.3 70B)
- **Cartesia** - Speech-to-text and text-to-speech
- **Gemini** - Document analysis and Gist Memory

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy
- **Railway/GCP** - Deployment

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+** (for backend)
- **Node.js 20+** (for frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)

### ⚡ Super Fast Setup (Windows)

```powershell
# 1. Clone the repository
git clone https://github.com/your-username/orkut-2.0.git
cd orkut-2.0

# 2. Start everything automatically
.\start-all.ps1
```

That's it! The script will:
- ✅ Check dependencies
- ✅ Install packages if needed
- ✅ Start backend (port 8000)
- ✅ Start frontend (port 3000)
- ✅ Open browser automatically

### 🔧 Manual Setup

#### Backend
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```powershell
cd frontend
npm install
npm run dev
```

### 🎮 Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

### 🔑 Demo Credentials

```
Email: demo@orkut.com
Password: demo123
```

## 📚 Documentation

### Getting Started
- [Quick Commands](./QUICK-COMMANDS.md) - Essential commands
- [Quickstart](./QUICKSTART.md) - Get started in 5 minutes
- [Troubleshooting](./TROUBLESHOOT-FAILED-TO-FETCH.md) - Fix common errors

### Features
- [Gist Memory Guide](./GIST-MEMORY-WORKING.md) - AI document analysis (NEW!)
- [Chat MSN Guide](./CHAT-MSN-COMPLETO-GUIDE.md) - MSN-style chat
- [P2P Share Guide](./P2P-SHARE-GUIDE.md) - File sharing
- [Communities Guide](./COMUNIDADES-GUIDE.md) - Communities system
- [Voice Agent Setup](./VOICE-AGENT-SETUP.md) - LiveKit voice agents

### Security
- [Security Guide](./SECURITY.md) - Complete security documentation
- [Security Checklist](./SECURITY-CHECKLIST.md) - Pre-deployment checklist
- [Security Best Practices](./docs/SECURITY-BEST-PRACTICES.md) - Developer guide

### Deployment
- [Deploy Guide](./DEPLOY.md) - Complete deployment guide
- [GCP Setup](./GCP-SETUP.md) - Google Cloud Platform
- [API Docs](http://localhost:8000/docs) - Interactive API documentation

## 🧪 Testing

### Quick Tests

```powershell
# Test Gist Memory (PDF upload & analysis)
.\test-gist-memory.ps1

# Test AI endpoints
.\test-ai-endpoints.ps1

# Test P2P upload
.\test-p2p-upload.ps1
```

### Manual Tests

```powershell
# Backend health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:3000

# Test login
curl -X POST http://localhost:8000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"demo@orkut.com","password":"demo123"}'
```

## 🔧 Development

### Useful Scripts

```powershell
# Start everything
.\start-all.ps1

# Start backend only
.\start-backend.ps1

# Start frontend only
.\start-frontend.ps1

# Test Gist Memory
.\test-gist-memory.ps1

# Test AI endpoints
.\test-ai-endpoints.ps1
```

### Backend Development

```powershell
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn app.main:app --reload

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend Development

```powershell
cd frontend

# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## 🚀 Deployment

### Railway (Recommended for MVP)

```bash
npm install -g @railway/cli
bash scripts/deploy-railway.sh
```

### GCP Cloud Run

```bash
# Edit PROJECT_ID in the script
bash scripts/deploy-gcp.sh
```

### Ubuntu VM

```bash
ssh root@your-ip
bash scripts/setup-vm.sh
```

See [DEPLOY.md](./DEPLOY.md) for more options.

## 📊 Monitoring

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

### Health Checks

```bash
# Backend
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000/health
```

## 🧠 Gist Memory - AI Document Analysis

### Features
- 📄 **PDF Upload** - Drag & drop or click to upload (max 50MB)
- 🔍 **Text Extraction** - Automatic text extraction with PyPDF2/pdfplumber
- 📊 **Smart Analysis** - Word count, topics, complexity, reading time
- 🏷️ **Topic Detection** - Automatic keyword extraction
- 💡 **Key Phrases** - Important sentences identification
- 📑 **Section Detection** - Intelligent document segmentation
- 🤖 **AI Summaries** - Powered by Cerebras LLaMA 3.3 70B
- 💬 **Q&A System** - Ask questions about your documents

### How to Use

1. **Access Gist Memory**
   ```
   http://localhost:3000/dashboard → Click "🧠 Gist Memory"
   ```

2. **Upload PDF**
   - Drag & drop a PDF file
   - Or click "📁 Select PDF"
   - Wait for processing

3. **View Analysis**
   - Document metrics (words, paragraphs, reading time)
   - Main topics and key phrases
   - Identified sections

4. **Generate Summaries**
   - Click "🚀 Generate Summaries"
   - Get AI-powered summaries for each section

5. **Ask Questions**
   - Type your question
   - Get contextual answers from the document

### Supported Formats
- ✅ PDF with selectable text
- ✅ Max size: 50MB
- ❌ Scanned PDFs (need OCR)
- ❌ Protected/encrypted PDFs

See [GIST-MEMORY-WORKING.md](./GIST-MEMORY-WORKING.md) for complete guide.

## 🏗️ Architecture

```
orkut-2.0/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Config, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   ├── tests/           # Pytest tests
│   └── alembic/         # Database migrations
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   └── services/    # API clients
│   └── public/          # Static assets
├── scripts/             # Deploy scripts
├── .github/workflows/   # CI/CD
└── docker-compose.yml   # Local development
```

## 🔐 Security

### Implemented Security Measures
- ✅ **JWT Authentication** - Secure token-based auth with expiration
- ✅ **Password Hashing** - Bcrypt with 12 rounds
- ✅ **CORS Whitelist** - No wildcard, explicit origins only
- ✅ **SQL Injection Protection** - Parameterized queries (SQLAlchemy)
- ✅ **XSS Protection** - HTML sanitization (DOMPurify)
- ✅ **Rate Limiting** - 60 req/min global, 5 login attempts/5min
- ✅ **Input Validation** - Zod (frontend) + Pydantic (backend)
- ✅ **Secure Error Handling** - No sensitive data in errors
- ✅ **API Keys Protected** - Backend proxy only, never exposed
- ✅ **HTTPS in Production** - TLS 1.3
- ✅ **Security Headers** - CSP, HSTS, X-Frame-Options
- ✅ **File Upload Validation** - Type, size, content checks

### Security Audit

```powershell
# Windows
.\scripts\security-audit.ps1

# Linux/macOS
./scripts/security-audit.sh
```

### Security Score: A+ 🛡️

See [SECURITY.md](./SECURITY.md) for complete documentation.

## 📈 Performance

- ⚡ KeyDB cache (4x faster than Redis)
- ⚡ Connection pooling
- ⚡ Async/await everywhere
- ⚡ CDN for static assets
- ⚡ Gzip compression
- ⚡ Database indexing

## 🤝 Contributing

1. Fork the project
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-feature`
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Original Orkut for inspiration
- FastAPI for the amazing framework
- React for the UI library
- Google Gemini for AI

## 🐛 Troubleshooting

### "Failed to fetch" Error
**Problem:** Frontend can't connect to backend

**Solution:**
```powershell
# Check if backend is running
curl http://localhost:8000/health

# If not, start it
.\start-backend.ps1
```

See [TROUBLESHOOT-FAILED-TO-FETCH.md](./TROUBLESHOOT-FAILED-TO-FETCH.md) for complete guide.

### PDF Upload Not Working
**Problem:** "PDF processing libraries not installed"

**Solution:**
```powershell
cd backend
pip install PyPDF2 pdfplumber
# Restart backend
```

See [GIST-MEMORY-WORKING.md](./GIST-MEMORY-WORKING.md) for complete guide.

### Port Already in Use
**Problem:** Port 8000 or 3000 already in use

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace <PID>)
taskkill /PID <PID> /F
```

### Common Issues
- ❌ Backend not running → Run `.\start-backend.ps1`
- ❌ Frontend not running → Run `.\start-frontend.ps1`
- ❌ Dependencies missing → Run `pip install -r requirements.txt` and `npm install`
- ❌ CORS error → Check `backend/.env` has correct origins
- ❌ PDF not extracting → Use PDF with selectable text (not scanned)

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/your-username/orkut-2.0/issues)
- 📚 Docs: See documentation links above
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/orkut-2.0/discussions)

## 🎯 Roadmap

### ✅ Completed
- [x] Core authentication and authorization
- [x] Communities system
- [x] MSN-style chat
- [x] Gist Memory with PDF upload
- [x] AI document analysis
- [x] P2P file sharing
- [x] Audio rooms
- [x] RSS feed reader
- [x] Security hardening

### 🚧 In Progress
- [ ] OCR for scanned PDFs
- [ ] Mobile app (React Native)
- [ ] Video calls
- [ ] Stories feature

### 📋 Planned
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] Marketplace
- [ ] API v2

---

Made with ❤️ and ☕ | **Orkut 2.0** - The social network you always wanted
