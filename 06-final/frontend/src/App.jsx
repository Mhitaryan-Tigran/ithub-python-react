import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LiveBoardProvider } from './LiveBoard';
import ActivityPage from './pages/ActivityPage';
import BoardPage from './pages/BoardPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import TaskPage from './pages/TaskPage';
import './app.css';

export default function App() {
  const [username, setUsername] = useState(() => sessionStorage.getItem('taskflow-user') ?? '');

  function login(name) {
    sessionStorage.setItem('taskflow-user', name);
    setUsername(name);
  }

  function logout() {
    sessionStorage.removeItem('taskflow-user');
    setUsername('');
  }

  if (!username) return <LoginPage onLogin={login} />;

  return (
    <LiveBoardProvider username={username}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout onLogout={logout} />}>
            <Route index element={<BoardPage />} />
            <Route path="tasks/:id" element={<TaskPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="activity" element={<ActivityPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LiveBoardProvider>
  );
}
