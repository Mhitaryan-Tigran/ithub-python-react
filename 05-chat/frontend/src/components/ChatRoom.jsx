import { useEffect, useRef, useState } from 'react';
import { useChat } from '../useChat';

function time(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

const STATUS = {
  connecting: { text: 'подключаемся…', cls: 'info' },
  open: { text: 'в сети', cls: 'ok' },
  closed: { text: 'соединение потеряно', cls: 'error' },
  taken: { text: 'имя уже занято', cls: 'error' },
};

export default function ChatRoom({ username, onLeave }) {
  const { messages, online, status, send } = useChat(username);
  const [text, setText] = useState('');
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  }

  return (
    <div className="chat">
      <aside className="card people">
        <h2>В чате · {online.length}</h2>
        <ul>
          {online.map((name) => (
            <li key={name} className={name === username ? 'me' : ''}>
              <span className="avatar">{name[0]?.toUpperCase()}</span>
              {name}
              {name === username && <span className="muted"> (вы)</span>}
            </li>
          ))}
        </ul>
        <button className="btn ghost" onClick={onLeave}>Выйти</button>
      </aside>
      <section className="card room">
        <header className="row between">
          <strong>Общий канал</strong>
          <span className={`pill ${STATUS[status].cls}`}>{STATUS[status].text}</span>
        </header>
        <ol className="messages">
          {messages.map((message, index) =>
            message.type === 'system' ? (
              <li key={index} className="system">
                <em>{message.text}</em> · {time(message.timestamp)}
              </li>
            ) : (
              <li key={index} className={`bubble ${message.username === username ? 'mine' : ''}`}>
                <span className="author">{message.username}</span>
                <span className="text">{message.text}</span>
                <span className="when">{time(message.timestamp)}</span>
              </li>
            ),
          )}
          <li ref={bottom} />
        </ol>
        <form className="row composer" onSubmit={submit}>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение" disabled={status !== 'open'} />
          <button className="btn" disabled={status !== 'open' || !text.trim()}>Отправить</button>
        </form>
      </section>
    </div>
  );
}
