import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './app.css';

export default function App() {
  return (
    <main className="page">
      <p className="eyebrow">Тема 2.3 · Apollo Client + Strawberry</p>
      <h1>Менеджер задач</h1>
      <p className="lead">Данные приходят из Python GraphQL-сервера через useQuery, изменения уходят через useMutation.</p>
      <div className="stack">
        <TaskForm />
        <TaskList />
      </div>
    </main>
  );
}
