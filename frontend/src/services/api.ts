import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
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
