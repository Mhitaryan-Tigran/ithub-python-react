import { useEffect, useState } from 'react';
import { errorMessage, uploadImage } from '../api';

function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} МБ` : `${Math.round(bytes / 1024)} КБ`;
}

export default function ImageUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function choose(event) {
    const picked = event.target.files?.[0] ?? null;
    setFile(picked);
    setError('');
    setProgress(0);
    setStatus('idle');
    if (!picked) setPreview(null);
  }

  async function send() {
    setStatus('uploading');
    setError('');
    try {
      const result = await uploadImage(file, setProgress);
      setStatus('done');
      onUploaded(result);
    } catch (err) {
      setStatus('error');
      setError(errorMessage(err));
    }
  }

  return (
    <section className="card stack">
      <h2>1. Выберите изображение</h2>
      <label className="drop">
        <input type="file" accept="image/*" onChange={choose} />
        {preview ? (
          <img src={preview} alt="Предпросмотр" className="preview" />
        ) : (
          <span className="muted">Нажмите, чтобы выбрать PNG или JPEG до 5 МБ</span>
        )}
      </label>
      {file && (
        <p className="muted file-meta">
          {file.name} · {file.type || 'неизвестный тип'} · {formatSize(file.size)} · предпросмотр через URL.createObjectURL
        </p>
      )}
      <div className="row">
        <button className="btn" onClick={send} disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? 'Отправляем…' : 'Отправить на сервер'}
        </button>
        {status !== 'idle' && status !== 'error' && (
          <div className="progress" aria-label="Прогресс загрузки">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span>{progress}%</span>
          </div>
        )}
      </div>
      {error && <div className="notice error">{error}</div>}
    </section>
  );
}
