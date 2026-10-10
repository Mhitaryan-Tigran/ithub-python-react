import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000';

export function apiFor(username) {
  return axios.create({ baseURL: API_URL, headers: { 'X-User': encodeURIComponent(username) } });
}

export function errorText(error) {
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg.replace('Value error, ', '')).join('; ');
  if (error.request) return 'Сервер недоступен. Проверьте, что backend запущен на :8000.';
  return 'Что-то пошло не так.';
}
