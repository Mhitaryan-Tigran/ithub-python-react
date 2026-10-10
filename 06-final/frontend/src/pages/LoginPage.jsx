import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('');

  return (
    <main className="login-screen">
      <form className="card stack login" onSubmit={(e) => { e.preventDefault(); if (name.trim()) onLogin(name.trim()); }}>
        <div className="brand big"><span className="logo">◆</span> TaskFlow</div>
        <p className="muted">Командная доска задач: всё, что делает команда, появляется у всех сразу.</p>
        <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" maxLength={32} />
        <button className="btn" disabled={!name.trim()}>Войти на доску</button>
      </form>
    </main>
  );
}
