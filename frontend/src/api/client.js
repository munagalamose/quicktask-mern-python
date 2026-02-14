import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const analyticsApi = axios.create({
  baseURL: ANALYTICS_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function setAnalyticsUserId(userId) {
  analyticsApi.defaults.headers.common['X-User-Id'] = userId;
}

export function clearAnalyticsUserId() {
  delete analyticsApi.defaults.headers.common['X-User-Id'];
}
