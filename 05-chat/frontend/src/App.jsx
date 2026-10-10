import { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import './app.css';

export default function App() {
  const [username, setUsername] = useState('');

  return (
    <main className="page wide">
      <p className="eyebrow">Тема 5.2 · FastAPI WebSocket + React</p>
      <h1>Чат команды</h1>
      <p className="lead">Сообщения и уведомления о входе и выходе приходят всем участникам мгновенно, без перезагрузки.</p>
      {username ? <ChatRoom username={username} onLeave={() => setUsername('')} /> : <Login onJoin={setUsername} />}
    </main>
  );
}
