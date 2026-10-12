import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../services/api';
import BackButton from './BackButton';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;
  if (!user) return <p style={{ padding: '20px' }}>Не удалось загрузить профиль</p>;

  return (
    <div className="form-container">
      <BackButton text="На главную" to="/" />

      <h1 className="form-title">👤 Мой профиль</h1>
      <p className="form-subtitle">Информация о вашем аккаунте</p>

      <div className="profile-row">
        <span className="profile-label">Имя пользователя</span>
        <span className="profile-value">{user.username}</span>
      </div>

      <div className="profile-row">
        <span className="profile-label">Email</span>
        <span className="profile-value">{user.email || '—'}</span>
      </div>

      <div className="profile-row">
        <span className="profile-label">Телефон</span>
        <span className="profile-value">{user.phone || '—'}</span>
      </div>

      <div className="profile-row">
        <span className="profile-label">Тип аккаунта</span>
        <span className="profile-value">
          {user.user_type === 'registered' && '👤 Зарегистрированный'}
          {user.user_type === 'verified_private' && '✅ Верифицированный частник'}
          {user.user_type === 'entrepreneur' && '🏢 ИП / Самозанятый'}
          {user.user_type === 'legal_entity' && '🏛️ Юридическое лицо'}
        </span>
      </div>

      <div className="profile-row">
        <span className="profile-label">Рейтинг доверия</span>
        <span className="profile-value">{user.trust_score || 0} ⚡</span>
      </div>

      <div style={styles.actions}>
        <Link to="/create" style={styles.primaryButton}>➕ Подать объявление</Link>
        <Link to="/chats" style={styles.secondaryButton}>💬 Мои чаты</Link>
        {user.user_type === 'registered' && (
          <Link to="/verify" style={styles.verifyButton}>✅ Пройти верификацию</Link>
        )}
      </div>
    </div>
  );
}

const styles = {
  actions: { marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '10px' },
  primaryButton: {
    display: 'block',
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  secondaryButton: {
    display: 'block',
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#e6f7ff',
    color: '#1a1a2e',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  verifyButton: {
    display: 'block',
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#00F0FF',
    color: '#1a1a2e',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
    boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
  },
};

export default Profile;