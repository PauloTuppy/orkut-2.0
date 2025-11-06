import axios from 'axios';

// ============================================================
// SEGURO: API client sem keys expostas
// Todas as keys ficam no backend!
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds
});

// ============================================================
// Request Interceptor: Adiciona JWT token (não API keys!)
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // ✅ Apenas JWT token, nunca API keys
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response Interceptor: Trata erros de forma segura
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: Token expirado ou inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Redirecionar sem expor motivo real
      window.location.href = '/login?session_expired=true';
    }

    // 429: Rate limit
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded');
    }

    // 500+: Erro de servidor (log seguro, sem dados sensíveis)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.status);
      // TODO: Enviar para monitoring (ex: Sentry)
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Communities API
export const communitiesAPI = {
  getAll: () => api.get('/communities'),
  getOne: (id: string) => api.get(`/communities/${id}`),
  create: (data: any) => api.post('/communities', data),
  join: (id: string) => api.post(`/communities/${id}/join`),
  leave: (id: string) => api.post(`/communities/${id}/leave`)
};

// Feed API
export const feedAPI = {
  getPosts: () => api.get('/feed/posts'),
  createPost: (content: string) =>
    api.post('/feed/posts', { content }),
  likePost: (postId: string) =>
    api.post(`/feed/posts/${postId}/like`),
  unlikePost: (postId: string) =>
    api.delete(`/feed/posts/${postId}/like`)
};

export default api;
