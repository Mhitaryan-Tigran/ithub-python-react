import { Link } from 'react-router-dom';
import { useLiveBoard } from '../LiveBoard';

function time(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityPage() {
  const { activity, tasks } = useLiveBoard();
  const done = tasks.filter((task) => task.status === 'done').length;

  return (
    <div className="activity">
      <section className="stats">
        <div className="card stat"><b>{tasks.length}</b><span>задач на доске</span></div>
        <div className="card stat"><b>{tasks.filter((task) => task.status === 'in_progress').length}</b><span>в процессе</span></div>
        <div className="card stat"><b>{tasks.length ? Math.round((done / tasks.length) * 100) : 0}%</b><span>выполнено</span></div>
      </section>
      <section className="card stack">
        <h2>Лента событий</h2>
        {activity.length === 0 && <p className="muted">Событий пока нет: создайте или передвиньте задачу.</p>}
        <ul className="feed">
          {activity.map((entry, index) => (
            <li key={`${entry.timestamp}-${index}`}>
              <span className="avatar tiny">{entry.actor[0]?.toUpperCase()}</span>
              <span><b>{entry.actor}</b> {entry.text}{' '}
                {entry.task_id && tasks.some((task) => task.id === entry.task_id) && <Link to={`/tasks/${entry.task_id}`}>открыть</Link>}
              </span>
              <time>{time(entry.timestamp)}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
