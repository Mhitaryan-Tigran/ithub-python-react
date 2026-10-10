import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WS_URL, apiFor } from './api';

const LiveBoardContext = createContext(null);

export function LiveBoardProvider({ username, children }) {
  const socket = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [chat, setChat] = useState([]);
  const [online, setOnline] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [toasts, setToasts] = useState([]);
  const [retry, setRetry] = useState(0);

  function toast(text, kind = 'info') {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, text, kind }]);
    setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 4500);
  }

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/ws/${encodeURIComponent(username)}`);
    socket.current = ws;
    setStatus('connecting');

    ws.onopen = () => setStatus('open');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'snapshot':
          setTasks(message.tasks);
          setActivity(message.activity);
          setChat(message.chat);
          setOnline(message.online);
          break;
        case 'task_created':
          setTasks((list) => [...list.filter((task) => task.id !== message.task.id), message.task]);
          setActivity((list) => [message.activity, ...list]);
          break;
        case 'task_updated':
          setTasks((list) => list.map((task) => (task.id === message.task.id ? message.task : task)));
          setActivity((list) => [message.activity, ...list]);
          break;
        case 'task_deleted':
          setTasks((list) => list.filter((task) => task.id !== message.task_id));
          setActivity((list) => [message.activity, ...list]);
          break;
        case 'presence':
          setOnline(message.online);
          break;
        case 'chat':
          setChat((list) => [...list, message.message]);
          break;
        case 'notification':
          toast(message.text, 'personal');
          break;
        default:
          break;
      }
    };
    ws.onclose = () => {
      setStatus('closed');
      setTimeout(() => setRetry((n) => n + 1), 2000);
    };

    return () => {
      ws.onclose = null;
      ws.close();
    };
  }, [username, retry]);

  const value = useMemo(
    () => ({
      username,
      api: apiFor(username),
      tasks,
      activity,
      chat,
      online,
      status,
      toasts,
      toast,
      sendChat: (text) => socket.current?.readyState === WebSocket.OPEN && socket.current.send(JSON.stringify({ type: 'chat', text })),
    }),
    [username, tasks, activity, chat, online, status, toasts],
  );

  return <LiveBoardContext.Provider value={value}>{children}</LiveBoardContext.Provider>;
}

export function useLiveBoard() {
  return useContext(LiveBoardContext);
}
