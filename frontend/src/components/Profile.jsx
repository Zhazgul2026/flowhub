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

  const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <BackButton text="На главную" to="/" />

      <div style={styles.profileHeader}>
        <div style={styles.avatar}>{initial}</div>
        <h1 style={styles.username}>{user.username}</h1>
        <p style={styles.userType}>
          {user.user_type === 'registered' && '👤 Зарегистрированный'}
          {user.user_type === 'verified_private' && '✅ Верифицированный частник'}
          {user.user_type === 'entrepreneur' && '🏢 ИП / Самозанятый'}
          {user.user_type === 'legal_entity' && '🏛️ Юридическое лицо'}
        </p>
        <div style={styles.rating}>Рейтинг доверия: <b>{user.trust_score || 0} ⚡</b></div>
      </div>

      <div style={styles.infoBlock}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Email</span>
          <span style={styles.infoValue}>{user.email || '—'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Телефон</span>
          <span style={styles.infoValue}>{user.phone || '—'}</span>
        </div>
      </div>

      <div style={styles.gridActions}>
        <Link to="/create" style={{ ...styles.actionCard, backgroundColor: '#e6f7ff' }}>
          <span style={styles.actionIcon}>➕</span>
          <span style={styles.actionText}>Подать объявление</span>
        </Link>
        <Link to="/my-adverts" style={{ ...styles.actionCard, backgroundColor: '#f5f5f5' }}>
          <span style={styles.actionIcon}>📋</span>
          <span style={styles.actionText}>Мои объявления</span>
        </Link>
        <Link to="/favorites" style={{ ...styles.actionCard, backgroundColor: '#ffeef0' }}>
          <span style={styles.actionIcon}>❤️</span>
          <span style={styles.actionText}>Избранное</span>
        </Link>
        <Link to="/chats" style={{ ...styles.actionCard, backgroundColor: '#f0f0f0' }}>
          <span style={styles.actionIcon}>💬</span>
          <span style={styles.actionText}>Мои чаты</span>
        </Link>
      </div>

      {user.user_type === 'registered' && (
        <Link to="/verify" style={styles.verifyButton}>
          ✅ Пройти верификацию для повышения доверия
        </Link>
      )}
    </div>
  );
}

const styles = {
  profileHeader: { textAlign: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '30px 20px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1a1a2e', color: '#00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', margin: '0 auto 15px' },
  username: { margin: '0 0 5px', fontSize: '24px', color: '#1a1a2e' },
  userType: { margin: '0 0 10px', color: '#666', fontSize: '14px' },
  rating: { fontSize: '14px', color: '#888' },
  infoBlock: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #eee', marginBottom: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  infoLabel: { color: '#888', fontSize: '14px' },
  infoValue: { fontWeight: '500', color: '#1a1a2e', fontSize: '14px' },
  gridActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  actionCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', borderRadius: '12px', textDecoration: 'none', color: '#1a1a2e', border: '1px solid #eee', transition: 'transform 0.2s', cursor: 'pointer' },
  actionIcon: { fontSize: '28px', marginBottom: '8px' },
  actionText: { fontSize: '14px', fontWeight: 'bold', textAlign: 'center' },
  verifyButton: { display: 'block', textAlign: 'center', padding: '14px', backgroundColor: '#00F0FF', color: '#1a1a2e', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' },
};

export default Profile;