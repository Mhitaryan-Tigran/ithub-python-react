import { useState } from 'react';

export default function Login({ onJoin }) {
  const [name, setName] = useState('');

  function submit(event) {
    event.preventDefault();
    if (name.trim()) onJoin(name.trim());
  }

  return (
    <form className="card stack login" onSubmit={submit}>
      <h2>Как вас представить?</h2>
      <div className="row">
        <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя в чате" maxLength={32} />
        <button className="btn" disabled={!name.trim()}>Войти в чат</button>
      </div>
      <p className="muted">Откройте вторую вкладку под другим именем, чтобы увидеть сообщения в реальном времени.</p>
    </form>
  );
}
