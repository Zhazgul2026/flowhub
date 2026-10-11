import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUnreadCount } from '../services/api';

function Header() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUnread = () => {
      getUnreadCount()
        .then((res) => setUnread(res.data.unread))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src="/logo.svg" alt="ФлоуХаб" className="logo-image" />
        </Link>

        <button
          className="burger-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>🏠 Главная</Link>
          <Link to="/create" className="nav-link" onClick={closeMenu}>➕ Подать объявление</Link>
          {isLoggedIn ? (
            <>
              <Link to="/chats" className="nav-link" onClick={closeMenu}>
                💬 Мои чаты
                {unread > 0 && <span className="nav-badge">{unread}</span>}
              </Link>
              <Link to="/profile" className="nav-link" onClick={closeMenu}>
                👤 {username || 'Профиль'}
              </Link>
              <button onClick={handleLogout} className="logout-button">🚪 Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>🔑 Вход</Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>✨ Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;