import { NavLink, Outlet } from 'react-router-dom';
import { useLiveBoard } from '../LiveBoard';

const STATUS = { connecting: 'подключаемся…', open: 'live', closed: 'переподключаемся…' };

export default function Layout({ onLogout }) {
  const { username, online, status, toasts, chat } = useLiveBoard();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo">◆</span> TaskFlow
        </div>
        <nav>
          <NavLink to="/" end>Доска</NavLink>
          <NavLink to="/chat">Чат <span className="count">{chat.length}</span></NavLink>
          <NavLink to="/activity">Активность</NavLink>
        </nav>
        <div className="presence">
          <span className={`live ${status}`}>● {STATUS[status]}</span>
          <div className="avatars" title={online.join(', ')}>
            {online.map((name) => (
              <span key={name} className={`avatar ${name === username ? 'me' : ''}`}>{name[0]?.toUpperCase()}</span>
            ))}
          </div>
          <button className="btn ghost small" onClick={onLogout}>{username} · выйти</button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <div className="toasts">
        {toasts.map((item) => (
          <div key={item.id} className={`toast ${item.kind}`}>{item.text}</div>
        ))}
      </div>
    </div>
  );
}
