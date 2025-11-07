// frontend/src/services/aiService.ts
import api from './api';

export interface GistMemoryResult {
  total_pages: number;
  gists: string[];
}

export interface Voice {
  id: string;
  name: string;
  language: string;
}

export interface Room {
  name: string;
  participants: number;
  active?: boolean;
}

export interface RoomToken {
  token: string;
  url: string;
}

export interface PDFUploadResult {
  filename: string;
  size: number;
  text: string;
  pages: number;
  words: number;
  message: string;
}

class AIService {
  // ============================================================
  // Gist Memory
  // ============================================================
  async createGistMemory(content: string, title: string): Promise<GistMemoryResult> {
    const response = await api.post('/ai/gist-memory', { content, title });
    return response.data;
  }

  async askQuestion(question: string, context: string): Promise<string> {
    const response = await api.post('/ai/ask-question', { question, context });
    return response.data.answer;
  }

  // ============================================================
  // Voice (Cartesia)
  // ============================================================
  async textToSpeech(text: string): Promise<Blob> {
    const response = await api.post('/ai/text-to-speech', null, {
      params: { text },
      responseType: 'blob'
    });
    return response.data;
  }

  async speechToText(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioFile);
    
    const response = await api.post('/ai/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.text;
  }

  async getVoices(): Promise<Voice[]> {
    const response = await api.get('/ai/voices');
    return response.data.voices;
  }

  // ============================================================
  // LiveKit Rooms
  // ============================================================
  async createRoom(roomName: string): Promise<Room> {
    const response = await api.post('/ai/rooms', null, {
      params: { room_name: roomName }
    });
    return response.data;
  }

  async getRooms(): Promise<Room[]> {
    const response = await api.get('/ai/rooms');
    return response.data.rooms;
  }

  async getRoomToken(roomName: string, userName: string): Promise<RoomToken> {
    const response = await api.post('/ai/token', null, {
      params: { room_name: roomName, user_name: userName }
    });
    return response.data;
  }

  // ============================================================
  // File Upload
  // ============================================================
  async uploadPDF(file: File, onProgress?: (progress: number) => void): Promise<PDFUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/ai/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
    return response.data;
  }

  async getSupportedFormats() {
    const response = await api.get('/ai/supported-formats');
    return response.data;
  }

  // ============================================================
  // RSS Feed
  // ============================================================
  async fetchRSSFeed(url: string, maxItems: number = 10) {
    const response = await api.post('/ai/rss/fetch', { url, max_items: maxItems });
    return response.data;
  }

  async getPopularFeeds() {
    const response = await api.get('/ai/rss/popular-feeds');
    return response.data;
  }

  async searchRSSContent(query: string, sources?: string[], maxItems: number = 20) {
    const response = await api.post('/ai/rss/search', { 
      query, 
      sources, 
      max_items: maxItems 
    });
    return response.data;
  }

  async testRSS() {
    const response = await api.get('/ai/rss/test');
    return response.data;
  }

  // ============================================================
  // P2P File Sharing
  // ============================================================
  async uploadFile(file: File, category: string = 'general', description: string = '', onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('description', description);
    
    const response = await api.post('/ai/p2p/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
    return response.data;
  }

  async getSharedFiles(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/ai/p2p/files?${params.toString()}`);
    return response.data;
  }

  async downloadFile(fileId: string) {
    const response = await api.get(`/ai/p2p/download/${fileId}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  getStreamUrl(fileId: string) {
    // Use direct URL since we're using proxy
    return `/api/ai/p2p/stream/${fileId}`;
  }

  async getP2PStats() {
    const response = await api.get('/ai/p2p/stats');
    return response.data;
  }

  async deleteFile(fileId: string) {
    const response = await api.delete(`/ai/p2p/file/${fileId}`);
    return response.data;
  }
}

export default new AIService();
