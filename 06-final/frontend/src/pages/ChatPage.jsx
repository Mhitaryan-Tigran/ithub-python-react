import { useEffect, useRef, useState } from 'react';
import { useLiveBoard } from '../LiveBoard';

function time(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { chat, username, sendChat, status } = useLiveBoard();
  const [text, setText] = useState('');
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [chat]);

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    sendChat(text.trim());
    setText('');
  }

  return (
    <section className="card room">
      <header><strong>Чат команды</strong> <span className="muted">· видят все, кто на доске</span></header>
      <ol className="messages">
        {chat.length === 0 && <li className="system">Напишите первое сообщение</li>}
        {chat.map((message, index) => (
          <li key={index} className={`bubble ${message.username === username ? 'mine' : ''}`}>
            <span className="author">{message.username}</span>
            <span>{message.text}</span>
            <span className="when">{time(message.timestamp)}</span>
          </li>
        ))}
        <li ref={bottom} />
      </ol>
      <form className="row composer" onSubmit={submit}>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение" disabled={status !== 'open'} />
        <button className="btn" disabled={status !== 'open' || !text.trim()}>Отправить</button>
      </form>
    </section>
  );
}
