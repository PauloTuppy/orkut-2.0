# Orkut 2.0 - Technical Information

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL + Cloud SQL
- **Cache**: KeyDB (fork multithreaded do Redis)
- **AI/ML**: Cerebras Inference (LLaMA 3.3 70B)
- **Voice**: Cartesia STT/TTS
- **Real-time**: LiveKit for video/audio/agents

## Integration

### Gist Memory API

```
POST /api/ai/process-document
Body: { document: string, title: string }
Returns: { pages: Page[], gists: string[] }
```

### Chat API

```
WebSocket /ws/chat/{room_id}
Real-time messages via Redis Pub/Sub
```

### Voice Agents API

```
POST /api/agents/start
Returns: { token: string, room: string }
```

## Performance

- Chat latency: < 50ms
- Feed load: < 100ms
- Gist Memory: < 1000ms
- Voice response: < 2000ms

## Scalability

- Auto-scaling via Kubernetes
- Load balancing via HAProxy
- CDN for static assets
- Database replication
