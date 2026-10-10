import { useState } from 'react';
import { errorText } from '../api';
import TaskCard from '../components/TaskCard';
import { useLiveBoard } from '../LiveBoard';

const COLUMNS = [
  { id: 'todo', title: 'К работе' },
  { id: 'in_progress', title: 'В процессе' },
  { id: 'done', title: 'Готово' },
];

export default function BoardPage() {
  const { tasks, api, online, toast, status } = useLiveBoard();
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState('');
  const [over, setOver] = useState(null);

  async function create(event) {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tasks', { title, assignee: assignee || null });
      setTitle('');
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function move(taskId, column) {
    setOver(null);
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === column) return;
    try {
      await api.patch(`/tasks/${taskId}`, { status: column });
    } catch (err) {
      toast(errorText(err), 'error');
    }
  }

  if (status === 'connecting' && tasks.length === 0) {
    return <div className="card row"><div className="spinner" /> Загружаем доску…</div>;
  }

  return (
    <>
      <form className="card create" onSubmit={create}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая задача для команды" />
        <select className="input select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">Без исполнителя</option>
          {online.map((name) => <option key={name}>{name}</option>)}
        </select>
        <button className="btn" disabled={!title.trim()}>Добавить</button>
        {error && <div className="notice error wide">{error}</div>}
      </form>
      <div className="board">
        {COLUMNS.map((column) => {
          const items = tasks.filter((task) => task.status === column.id).sort((a, b) => b.priority - a.priority);
          return (
            <section
              key={column.id}
              className={`column ${over === column.id ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(column.id); }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => move(Number(e.dataTransfer.getData('text/plain')), column.id)}
            >
              <h2>{column.title} <span className="count">{items.length}</span></h2>
              {items.map((task) => (
                <div key={task.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(task.id))}>
                  <TaskCard task={task} />
                </div>
              ))}
              {items.length === 0 && <p className="empty">Перетащите задачу сюда</p>}
            </section>
          );
        })}
      </div>
    </>
  );
}
