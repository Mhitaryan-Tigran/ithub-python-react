import ReportProgress from './components/ReportProgress';
import './app.css';

export default function App() {
  return (
    <main className="page">
      <p className="eyebrow">Тема 4.3 · FastAPI + sse-starlette + EventSource</p>
      <h1>Прогресс в реальном времени</h1>
      <p className="lead">Сервер шлёт именованные события progress и complete, страница обновляется без перезагрузки и без поллинга.</p>
      <ReportProgress />
    </main>
  );
}
