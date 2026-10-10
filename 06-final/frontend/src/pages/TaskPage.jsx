import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { errorText } from '../api';
import { useLiveBoard } from '../LiveBoard';

const STATUSES = { todo: 'К работе', in_progress: 'В процессе', done: 'Готово' };

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, api, online, activity, toast } = useLiveBoard();
  const task = tasks.find((item) => item.id === Number(id));
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task && !form) setForm({ title: task.title, description: task.description, assignee: task.assignee ?? '', priority: task.priority, status: task.status });
  }, [task, form]);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!task) {
    return (
      <div className="card stack">
        <h2>Задача не найдена</h2>
        <p className="muted">Возможно, её только что удалил другой участник.</p>
        <Link to="/" className="btn">К доске</Link>
      </div>
    );
  }
  if (!form) return null;

  const people = Array.from(new Set([...online, task.assignee].filter(Boolean)));
  const history = activity.filter((entry) => entry.task_id === task.id);

  async function save(event) {
    event.preventDefault();
    setError('');
    try {
      await api.patch(`/tasks/${task.id}`, { ...form, assignee: form.assignee || null, priority: Number(form.priority) });
      toast('Сохранено', 'ok');
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function uploadCover() {
    const body = new FormData();
    body.append('file', file);
    setError('');
    try {
      await api.post(`/tasks/${task.id}/cover`, body, { onUploadProgress: (e) => setProgress(Math.round((e.loaded / (e.total || 1)) * 100)) });
      setFile(null);
      setPreview(null);
      setProgress(0);
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function remove() {
    await api.delete(`/tasks/${task.id}`);
    navigate('/');
  }

  return (
    <div className="detail">
      <form className="card stack" onSubmit={save}>
        <Link to="/" className="back">← Доска</Link>
        {task.cover_url && <img src={task.cover_url} alt="Обложка" className="detail-cover" />}
        <input className="input title-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input" rows={4} value={form.description} placeholder="Описание" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="fields">
          <label>Статус
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {Object.entries(STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>Исполнитель
            <select className="input" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Без исполнителя</option>
              {people.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label>Приоритет
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value={1}>Низкий</option>
              <option value={2}>Средний</option>
              <option value={3}>Высокий</option>
            </select>
          </label>
        </div>
        {error && <div className="notice error">{error}</div>}
        <div className="row">
          <button className="btn">Сохранить</button>
          <button type="button" className="btn ghost danger" onClick={remove}>Удалить</button>
        </div>
      </form>
      <aside className="stack">
        <section className="card stack">
          <h2>Обложка</h2>
          <label className="drop">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {preview ? <img src={preview} alt="Предпросмотр" /> : <span className="muted">PNG или JPEG до 5 МБ</span>}
          </label>
          {file && (
            <button className="btn" onClick={uploadCover}>{progress ? `Загрузка ${progress}%` : 'Загрузить обложку'}</button>
          )}
        </section>
        <section className="card stack">
          <h2>История</h2>
          {history.length === 0 && <p className="muted">Изменений пока нет.</p>}
          <ul className="feed compact">
            {history.map((entry, index) => (
              <li key={index}><b>{entry.actor}</b> {entry.text}</li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
