import { useEffect, useRef, useState } from 'react';

const WS = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000';

export function useChat(username) {
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    if (!username) return undefined;
    const ws = new WebSocket(`${WS}/ws/${encodeURIComponent(username)}`);
    socket.current = ws;
    setStatus('connecting');

    ws.onopen = () => setStatus('open');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'system') setOnline(message.online);
      setMessages((list) => [...list, message]);
    };
    ws.onclose = (event) => setStatus(event.code === 4409 ? 'taken' : 'closed');
    ws.onerror = () => setStatus('closed');

    return () => ws.close();
  }, [username]);

  function send(text) {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ text }));
    }
  }

  return { messages, online, status, send };
}
