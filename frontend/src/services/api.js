import axios from 'axios';

/**
 * Resolve the backend base URL.
 *
 * Production (Vercel): set `VITE_API_URL=https://bankprepare-ai-v2.onrender.com`
 *   (bare host — `/api/v1` is appended automatically).
 * Local dev fallback: `http://localhost:8000` (+ `/api/v1`).
 *
 * `VITE_API_BASE_URL` is still honoured as a legacy alias so existing
 * checkouts keep working. A value that already ends with `/api/v1` is
 * used as-is, so there is never a duplicated `/api` prefix.
 */
function resolveApiBaseUrl() {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000';
  const trimmed = String(raw).trim().replace(/\/+$/, '');
  if (/\/api\/v1$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
}

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Render free tier sleeps when idle (cold start can take ~30-60s).
  timeout: 60000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bankprepare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bankprepare_token');
      localStorage.removeItem('bankprepare_user');
      // If not already on login or register, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
