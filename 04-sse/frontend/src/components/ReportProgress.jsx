import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function ReportProgress() {
  const [runId, setRunId] = useState(0);
  const [percent, setPercent] = useState(0);
  const [log, setLog] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (runId === 0) return undefined;

    const source = new EventSource(`${API}/jobs/report/stream`);
    setStatus('running');

    source.addEventListener('progress', (event) => {
      const data = JSON.parse(event.data);
      setPercent(data.percent);
      setLog((items) => [...items, { kind: 'progress', text: `${data.percent}% — ${data.message}` }]);
    });

    source.addEventListener('complete', (event) => {
      const data = JSON.parse(event.data);
      setStatus('done');
      setLog((items) => [...items, { kind: 'complete', text: `${data.message}: ${data.result_url}` }]);
      source.close();
    });

    source.onerror = () => {
      setStatus('error');
      setError('Соединение с сервером потеряно. Проверьте, что backend запущен на :8000, и запустите снова.');
      source.close();
    };

    return () => source.close();
  }, [runId]);

  function start() {
    setPercent(0);
    setLog([]);
    setError('');
    setRunId((id) => id + 1);
  }

  return (
    <section className="card stack">
      <div className="row between">
        <h2>Квартальный отчёт по задачам</h2>
        <span className={`badge ${status}`}>{{ idle: 'не запущен', running: 'идёт', done: 'готово', error: 'ошибка' }[status]}</span>
      </div>
      <progress value={percent} max={100} />
      <div className="percent">{percent}%</div>
      <button className="btn" onClick={start} disabled={status === 'running'}>
        {status === 'running' ? 'Генерируем…' : status === 'idle' ? 'Сгенерировать отчёт' : 'Запустить заново'}
      </button>
      {error && <div className="notice error">{error}</div>}
      {log.length > 0 && (
        <ol className="log">
          {log.map((item, index) => (
            <li key={index} className={item.kind}>
              <code>event: {item.kind}</code> {item.text}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
