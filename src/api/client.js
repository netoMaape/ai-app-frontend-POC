import axios from 'axios';

const baseURL =
  localStorage.getItem('api_base_url') ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

const client = axios.create({
  baseURL,
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const message =
      (typeof detail === 'string' && detail) ||
      (Array.isArray(detail) && detail[0]?.msg) ||
      error.message ||
      'Network request failed';

    // Auto-logout on expired/invalid token (but not on the login attempt itself)
    if (status === 401 && !error.config.url?.includes('/auth/login')) {
      localStorage.removeItem('auth_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const wrapped = new Error(message);
    wrapped.status = status;
    return Promise.reject(wrapped);
  }
);

export default client;