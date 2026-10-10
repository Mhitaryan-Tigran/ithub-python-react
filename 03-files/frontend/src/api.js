import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000' });

export async function uploadImage(file, onProgress) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/uploads', form, {
    onUploadProgress: (event) => {
      const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
      console.log(`Загрузка: ${percent}%`);
      onProgress(percent);
    },
  });
  return data;
}

export function errorMessage(error) {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    return typeof detail === 'string' ? detail : 'Сервер отклонил файл.';
  }
  if (error.request) return 'Сервер недоступен. Проверьте, что backend запущен на :8000.';
  return 'Что-то пошло не так. Попробуйте ещё раз.';
}
