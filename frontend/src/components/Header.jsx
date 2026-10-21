import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUnreadCount } from '../services/api';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isLoggedIn = !!localStorage.getItem('access_token');
  const username = localStorage.getItem('username');

  // Синхронизируем поиск с URL (если на главной уже есть ?search=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
  }, [location.search]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(`/?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/');
    }
    closeMenu();
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src="/logo.svg" alt="ЗипТап" className="logo-image" />
        </Link>

        {/* Поле поиска (десктоп) */}
        <form onSubmit={handleSearchSubmit} className="header-search-form" style={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Что ищем? Например: Toyota Camry"
            className="header-search-input"
            style={styles.searchInput}
          />
          <button type="submit" className="header-search-btn" style={styles.searchButton}>
            🔍
          </button>
        </form>

        <button
          className="burger-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          {/* Поле поиска (в бургер-меню на мобилке) */}
          <form onSubmit={handleSearchSubmit} style={{ ...styles.searchForm, marginBottom: '10px', display: 'none' }} className="mobile-search-form">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Что ищем?"
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>🔍</button>
          </form>

          <Link to="/" className="nav-link" onClick={closeMenu}>🏠 Главная</Link>
          <Link to="/create" className="nav-link" onClick={closeMenu}>➕ Подать объявление</Link>
          {isLoggedIn ? (
            <>
              <Link to="/chats" className="nav-link" onClick={closeMenu}>
                💬 Мои чаты
                {unread > 0 && <span className="nav-badge">{unread}</span>}
              </Link>
              <Link to="/favorites" className="nav-link" onClick={closeMenu}>❤️ Избранное</Link>
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

const styles = {
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    flex: '1 1 auto',
    maxWidth: '480px',
    margin: '0 20px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  searchButton: {
    padding: '10px 16px',
    backgroundColor: '#00F0FF',
    border: '1px solid #00F0FF',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
};

export default Header;