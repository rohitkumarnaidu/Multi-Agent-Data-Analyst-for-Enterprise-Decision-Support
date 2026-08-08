import axios from 'axios';

// Development mock token for testing against frozen backend
const MOCK_JWT_TOKEN = 'REMOVED_SECRET';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you would fetch this from localStorage/sessionStorage or a context
    const token = MOCK_JWT_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
