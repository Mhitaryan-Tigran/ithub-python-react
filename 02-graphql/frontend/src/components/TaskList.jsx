import { useMutation, useQuery } from '@apollo/client/react';
import { ALL_TASKS } from '../graphql/queries';
import { COMPLETE_TASK, DELETE_TASK } from '../graphql/mutations';

export default function TaskList() {
  const { data, loading, error, refetch } = useQuery(ALL_TASKS);
  const [completeTask] = useMutation(COMPLETE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, { refetchQueries: [ALL_TASKS] });

  if (loading) {
    return (
      <div className="card row"><div className="spinner" /> <span className="muted">Загружаем задачи…</span></div>
    );
  }

  if (error) {
    return (
      <div className="notice error stack">
        <span>Не удалось загрузить задачи: сервер GraphQL недоступен. Проверьте, что backend запущен на :8000.</span>
        <button className="btn ghost" onClick={() => refetch()}>Повторить</button>
      </div>
    );
  }

  const tasks = data.allTasks;
  if (tasks.length === 0) return <p className="muted">Задач пока нет — создайте первую.</p>;

  return (
    <ul className="tasks">
      {tasks.map((task) => (
        <li key={task.id} className={`card task ${task.isCompleted ? 'done' : ''}`}>
          <div className="task-main">
            <span className="tag">
              <span className="dot" style={{ background: task.category.color }} />
              {task.category.name}
            </span>
            <h3>{task.title}</h3>
            {task.description && <p className="muted">{task.description}</p>}
          </div>
          <div className="row">
            {task.isCompleted ? (
              <span className="status">✓ Выполнено</span>
            ) : (
              <button className="btn" onClick={() => completeTask({ variables: { id: task.id } })}>Выполнить</button>
            )}
            <button className="btn ghost" onClick={() => deleteTask({ variables: { id: task.id } })}>Удалить</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
