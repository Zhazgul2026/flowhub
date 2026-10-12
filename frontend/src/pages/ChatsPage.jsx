import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChats } from '../services/api';
import BackButton from '../components/BackButton';

function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChats()
      .then((res) => setChats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentUser = localStorage.getItem('username');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <BackButton text="На главную" to="/" />

      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#1a1a2e' }}>
        💬 Мои чаты
      </h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : chats.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Пока нет диалогов</p>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Откройте любое объявление и нажмите «Связаться с продавцом»
          </p>
          <Link to="/" style={styles.emptyButton}>Найти товары</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {chats.map((chat) => (
            <Link key={chat.id} to={`/chat/${chat.id}`} style={styles.chatCard}>
              <div style={styles.chatHeader}>
                <span style={styles.chatTitle}>{chat.advert_title}</span>
                {chat.unread_count > 0 && (
                  <span style={styles.unreadBadge}>{chat.unread_count}</span>
                )}
              </div>
              <div style={styles.chatInfo}>
                {chat.buyer_username === currentUser
                  ? `Продавец: ${chat.seller_username}`
                  : `Покупатель: ${chat.buyer_username}`}
              </div>
              {chat.last_message && (
                <div style={styles.lastMessage}>
                  <b>{chat.last_message.sender_username}:</b>{' '}
                  {chat.last_message.text.length > 60
                    ? chat.last_message.text.slice(0, 60) + '...'
                    : chat.last_message.text}
                </div>
              )}
              <div style={styles.chatDate}>{formatDate(chat.updated_at)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  empty: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px' },
  emptyButton: { display: 'inline-block', marginTop: '20px', padding: '12px 25px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  chatCard: { display: 'block', padding: '18px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', textDecoration: 'none', color: '#333' },
  chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '10px' },
  chatTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e' },
  unreadBadge: { backgroundColor: '#00F0FF', color: '#1a1a2e', padding: '3px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 },
  chatInfo: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  lastMessage: { fontSize: '14px', color: '#888', fontStyle: 'italic', marginBottom: '6px' },
  chatDate: { fontSize: '12px', color: '#aaa', textAlign: 'right' },
};

export default ChatsPage;