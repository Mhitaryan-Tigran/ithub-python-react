import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ALL_TASKS, CATEGORIES } from '../graphql/queries';
import { CREATE_TASK } from '../graphql/mutations';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Работа');
  const { data } = useQuery(CATEGORIES);
  const [createTask, { loading, error }] = useMutation(CREATE_TASK, { refetchQueries: [ALL_TASKS] });

  async function submit(event) {
    event.preventDefault();
    try {
      await createTask({ variables: { title, category } });
      setTitle('');
    } catch {
      return;
    }
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Новая задача</h2>
      <div className="row">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название задачи" />
        <select className="input select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {(data?.categories ?? [{ name: 'Работа' }]).map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <button className="btn" disabled={loading || !title.trim()}>{loading ? 'Создаём…' : 'Создать'}</button>
      </div>
      {error && <div className="notice error">{error.message}</div>}
    </form>
  );
}
