import { Link } from 'react-router-dom';

const PRIORITY = { 1: 'низкий', 2: 'средний', 3: 'высокий' };

export default function TaskCard({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="task-card">
      {task.cover_url && <img src={task.cover_url} alt="" className="cover" />}
      <span className={`prio p${task.priority}`}>{PRIORITY[task.priority]}</span>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <footer>
        {task.assignee ? (
          <span className="who"><span className="avatar tiny">{task.assignee[0].toUpperCase()}</span>{task.assignee}</span>
        ) : (
          <span className="muted">не назначена</span>
        )}
      </footer>
    </Link>
  );
}
