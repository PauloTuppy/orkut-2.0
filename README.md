# 🚀 Orkut 2.0

Modern social network inspired by classic Orkut, built with cutting-edge technologies and ready to scale.

## ✨ Features

- 🔐 Secure JWT authentication
- 👥 Friends and communities system
- 💬 Real-time chat (WebSockets + MSN Messenger style)
- 📝 Posts and testimonials
- 🤖 Integrated AI (Gemini API + Cerebras LLM)
- 🎤 Voice AI Agents (LiveKit + Cartesia)
- 📰 RSS Feed Reader with Gist Memory
- 🎙️ Audio Rooms (Clubhouse style)
- 📁 P2P File Sharing (Napster style)
- ⚡ Smart caching with KeyDB
- 🗄️ SmartSQL for optimized queries
- 📊 Monitoring and logging

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
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/orkut-2.0.git
cd orkut-2.0

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Start with Docker Compose
docker compose up -d

# Run migrations
docker compose exec backend alembic upgrade head
```

### Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **PostgreSQL:** localhost:5432
- **KeyDB:** localhost:6380

## 📚 Documentation

- [Quickstart](./QUICKSTART.md) - Get started in 5 minutes
- [Deploy Guide](./DEPLOY.md) - Complete deployment guide
- [Voice Agent Setup](./VOICE-AGENT-SETUP.md) - LiveKit voice agents guide
- [Security Guide](./SECURITY.md) - Security documentation
- [Security Checklist](./SECURITY-CHECKLIST.md) - Pre-deployment checklist
- [Security Best Practices](./docs/SECURITY-BEST-PRACTICES.md) - Developer guide
- [API Docs](http://localhost:8000/docs) - Interactive documentation
- [Voice Agent Docs](./orkut-voice-agent/README.md) - Voice agent documentation

## 🧪 Testing

```bash
# Backend
docker compose exec backend pytest

# Frontend
docker compose exec frontend npm test

# Lint
docker compose exec backend flake8 app
docker compose exec frontend npm run lint
```

## 🔧 Development

### Backend

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build
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

## 🤖 Gemini API

### Configuration

1. Get API Key: https://makersuite.google.com/app/apikey
2. Add to `.env`: `GOOGLE_GEMINI_API_KEY=your-key`
3. Restart: `docker compose restart backend`

### Usage

```python
# backend/app/services/gemini.py
from app.services.gemini import summarize_text

summary = await summarize_text("Your text here...")
```

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

- ✅ JWT authentication with expiration
- ✅ Password hashing (Bcrypt, 12 rounds)
- ✅ CORS whitelist (no wildcard)
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (HTML sanitization)
- ✅ Rate limiting (60 req/min, 5 login attempts/5min)
- ✅ Input validation (Zod + Pydantic)
- ✅ Secure error handling
- ✅ API keys protected (backend proxy only)
- ✅ HTTPS in production
- ✅ Security audit scripts

**Run security audit:**
```bash
# Linux/macOS
./scripts/security-audit.sh

# Windows
.\scripts\security-audit.ps1
```

See [SECURITY.md](./SECURITY.md) for complete security documentation.

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

## 📞 Support

- 📧 Email: your-email@example.com
- 💬 Discord: [Server link]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/orkut-2.0/issues)

---

Made with ❤️ and ☕
