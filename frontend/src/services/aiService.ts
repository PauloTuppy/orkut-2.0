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
}

export default new AIService();
