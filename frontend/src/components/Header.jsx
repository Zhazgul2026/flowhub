import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUnreadCount } from '../services/api';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Меню профиля
  const [search, setSearch] = useState('');
  
  const isLoggedIn = !!localStorage.getItem('access_token');
  const username = localStorage.getItem('username');

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

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

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
    <header className="site-header" style={{ position: 'relative', zIndex: 100 }}>
      <div className="header-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src="/logo.svg" alt="ЗипТап" className="logo-image" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="header-search-form" style={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Что ищем? Например: Toyota Camry"
            className="header-search-input"
            style={styles.searchInput}
          />
          <button type="submit" className="header-search-btn" style={styles.searchButton}>🔍</button>
        </form>

        <button className="burger-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/create" className="nav-link" onClick={closeMenu} style={{ marginRight: '15px' }}>➕ Подать</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/chats" className="nav-link" onClick={closeMenu} style={{ position: 'relative', marginRight: '15px' }}>
                💬 Чаты
                {unread > 0 && <span style={styles.badge}>{unread}</span>}
              </Link>
              
              {/* ВЫПАДАЮЩЕЕ МЕНЮ ПРОФИЛЯ */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                  style={styles.profileBtn}
                >
                  👤 {username || 'Профиль'} ▾
                </button>
                
                {profileMenuOpen && (
                  <div style={styles.dropdown}>
                    <Link to="/profile" style={styles.dropdownItem} onClick={closeMenu}>Мой профиль</Link>
                    <Link to="/my-adverts" style={styles.dropdownItem} onClick={closeMenu}>Мои объявления</Link>
                    <Link to="/favorites" style={styles.dropdownItem} onClick={closeMenu}>❤️ Избранное</Link>
                    <div style={{ borderTop: '1px solid #eee', margin: '5px 0' }}></div>
                    <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: '#cc0000', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 15px', fontSize: '14px' }}>
                      🚪 Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>🔑 Вход</Link>
              <Link to="/register" className="nav-link" onClick={closeMenu} style={{ marginLeft: '15px' }}>✨ Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  searchForm: { display: 'flex', alignItems: 'center', gap: '0', flex: '1 1 auto', maxWidth: '480px', margin: '0 20px' },
  searchInput: { flex: 1, padding: '10px 14px', border: '1px solid #ccc', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  searchButton: { padding: '10px 16px', backgroundColor: '#00F0FF', border: '1px solid #00F0FF', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: '16px', color: '#1a1a2e', fontWeight: 'bold' },
  badge: { position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#FF4444', color: '#fff', fontSize: '10px', borderRadius: '10px', padding: '2px 6px', fontWeight: 'bold' },
  profileBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', padding: '10px' },
  dropdown: { position: 'absolute', top: '100%', right: 0, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.15)', minWidth: '200px', display: 'flex', flexDirection: 'column', padding: '5px 0', marginTop: '5px' },
  dropdownItem: { padding: '10px 15px', textDecoration: 'none', color: '#333', fontSize: '14px', display: 'block', transition: 'background 0.2s' }
};

export default Header;