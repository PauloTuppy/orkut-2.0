import redis
import json
import os
from typing import Any, Optional

class CacheLayer:
    """Cache com KeyDB (Redis-compatible)"""
    
    def __init__(self):
        self.enabled = os.getenv("CACHE_ENABLED", "true").lower() == "true"
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.ttl = int(os.getenv("CACHE_TTL", 3600))
        
        if self.enabled:
            self.client = redis.from_url(self.redis_url, decode_responses=True)
        else:
            self.client = None
    
    async def get(self, key: str) -> Optional[Any]:
        """Get from cache"""
        if not self.enabled:
            return None
        
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            print(f"Cache get error: {e}")
        return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set cache with TTL"""
        if not self.enabled:
            return False
        
        try:
            ttl = ttl or self.ttl
            self.client.setex(
                key,
                ttl,
                json.dumps(value, default=str)
            )
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
        return False
    
    async def delete(self, key: str) -> bool:
        """Delete from cache"""
        if not self.enabled:
            return False
        
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
        return False
    
    async def pub(self, channel: str, message: Any):
        """Publish message (Pub/Sub)"""
        if not self.enabled:
            return
        
        try:
            self.client.publish(
                channel,
                json.dumps(message, default=str)
            )
        except Exception as e:
            print(f"Pub error: {e}")
    
    async def clear(self):
        """Clear all cache"""
        if not self.enabled:
            return
        
        try:
            self.client.flushdb()
        except Exception as e:
            print(f"Clear cache error: {e}")

# Global instance
cache = CacheLayer()
