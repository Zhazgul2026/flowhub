import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyAdverts, deleteAdvert } from '../services/api';
import BackButton from '../components/BackButton';

function MyAdvertsPage() {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Войдите, чтобы увидеть свои объявления');
      navigate('/login');
      return;
    }
    loadAdverts();
  }, [isLoggedIn, navigate]);

  const loadAdverts = () => {
    setLoading(true);
    getMyAdverts()
      .then((res) => setAdverts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить объявление?')) return;
    try {
      await deleteAdvert(id);
      setAdverts(adverts.filter((a) => a.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const tabs = [
    { key: 'active', label: '✅ Активные', icon: '✅' },
    { key: 'moderation', label: '⏳ На модерации', icon: '⏳' },
    { key: 'inactive', label: '❌ Неактивные', icon: '❌' },
    { key: 'expired', label: '⚰️ Истёкшие', icon: '⚰️' },
  ];

  const filteredAdverts = adverts.filter((a) => {
    if (tab === 'active') return a.status === 'active';
    if (tab === 'moderation') return a.status === 'moderation';
    if (tab === 'inactive') return ['blocked', 'sold'].includes(a.status);
    if (tab === 'expired') return a.status === 'expired';
    return true;
  });

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    if (status === 'active') return '#00F0FF';
    if (status === 'moderation') return '#FFB800';
    if (status === 'expired') return '#FF6B6B';
    if (status === 'blocked') return '#888';
    return '#888';
  };

  const getStatusLabel = (status) => {
    if (status === 'active') return '✅ Активно';
    if (status === 'moderation') return '⏳ На модерации';
    if (status === 'expired') return '⚰️ Истекло';
    if (status === 'blocked') return '❌ Заблокировано';
    if (status === 'sold') return '📦 Продано';
    return status;
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <BackButton text="На главную" to="/" />

      <h1 style={styles.title}>📋 Мои объявления</h1>

      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              ...styles.tab,
              ...(tab === t.key ? styles.tabActive : {}),
            }}
          >
            {t.label} ({adverts.filter((a) => {
              if (t.key === 'active') return a.status === 'active';
              if (t.key === 'moderation') return a.status === 'moderation';
              if (t.key === 'inactive') return ['blocked', 'sold'].includes(a.status);
              if (t.key === 'expired') return a.status === 'expired';
              return false;
            }).length})
          </button>
        ))}
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : filteredAdverts.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            {tab === 'active' ? 'Нет активных объявлений' :
             tab === 'moderation' ? 'Нет объявлений на модерации' :
             tab === 'inactive' ? 'Нет неактивных объявлений' :
             'Нет истёкших объявлений'}
          </p>
          {tab === 'active' && (
            <Link to="/create" style={styles.emptyButton}>➕ Подать объявление</Link>
          )}
        </div>
      ) : (
        <div style={styles.list}>
          {filteredAdverts.map((advert) => (
            <div key={advert.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <Link to={`/advert/${advert.id}`} style={styles.cardTitle}>
                  {advert.title}
                </Link>
                <span style={{ ...styles.statusBadge, color: getStatusColor(advert.status) }}>
                  {getStatusLabel(advert.status)}
                </span>
              </div>

              <div style={styles.cardInfo}>
                <span style={styles.price}>{formatPrice(advert.price)} ₽</span>
                {advert.category_name && <span style={styles.category}> · {advert.category_name}</span>}
              </div>

              <div style={styles.cardDates}>
                <span>Создано: {formatDate(advert.created_at)}</span>
                {advert.expires_at && <span> · До: {formatDate(advert.expires_at)}</span>}
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => navigate(`/edit/${advert.id}`)}
                  style={styles.editButton}
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={() => handleDelete(advert.id)}
                  style={styles.deleteButton}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: '28px', marginBottom: '20px', color: '#1a1a2e' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  tab: { padding: '10px 16px', backgroundColor: '#f0f0f0', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', fontFamily: 'inherit', transition: 'all 0.2s' },
  tabActive: { backgroundColor: '#e6f7ff', borderColor: '#00F0FF', color: '#1a1a2e', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)' },
  empty: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px' },
  emptyButton: { display: 'inline-block', marginTop: '20px', padding: '12px 25px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px', gap: '10px', flexWrap: 'wrap' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', textDecoration: 'none', flex: 1 },
  statusBadge: { fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  cardInfo: { marginBottom: '8px' },
  price: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' },
  category: { color: '#666' },
  cardDates: { fontSize: '13px', color: '#888', marginBottom: '15px' },
  cardActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  editButton: { padding: '10px 18px', backgroundColor: '#00F0FF', color: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', fontFamily: 'inherit', transition: 'all 0.2s', flex: 1, minWidth: '140px' },
  deleteButton: { padding: '10px 18px', backgroundColor: '#FF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', fontFamily: 'inherit', transition: 'all 0.2s', flex: 1, minWidth: '140px' },
};

export default MyAdvertsPage;