import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAdverts, deleteAdvert, renewAdvert } from '../services/api';
import BackButton from '../components/BackButton';

function MyAdvertsPage() {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, status: '' });

  const fetchAdverts = () => {
    setLoading(true);
    getMyAdverts()
      .then((res) => setAdverts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdverts();
  }, []);

  const handleDeleteClick = (id, status) => {
    if (status === 'moderation' || status === 'rejected') {
      if (window.confirm('Удалить это объявление? Оно ещё не опубликовано.')) {
        executeDelete(id);
      }
    } else {
      setDeleteModal({ open: true, id, status });
    }
  };

  const executeDelete = async (id) => {
    try {
      await deleteAdvert(id);
      setDeleteModal({ open: false, id: null, status: '' });
      fetchAdverts();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleRenew = async (id) => {
    try {
      await renewAdvert(id);
      alert('Объявление продлено на 30 дней и отправлено на модерацию');
      fetchAdverts();
    } catch (err) {
      alert('Ошибка при продлении');
    }
  };

  const statusColors = {
    active: '#008000',
    moderation: '#ff8c00',
    rejected: '#cc0000',
    sold: '#0066cc',
    expired: '#888888',
  };

  const statusLabels = {
    active: '✅ Активно',
    moderation: '⏳ На модерации',
    rejected: '❌ Отклонено',
    sold: '🤝 Продано',
    expired: '🕒 Истекло',
  };

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <BackButton text="На главную" to="/" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="form-title" style={{ margin: 0 }}>📋 Мои объявления</h1>
        <Link to="/create" style={{ padding: '10px 15px', backgroundColor: '#00F0FF', color: '#1a1a2e', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Новое</Link>
      </div>

      {adverts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
          <p>У вас пока нет объявлений.</p>
          <Link to="/create" style={{ color: '#00F0FF', fontWeight: 'bold' }}>Создать первое</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {adverts.map((advert) => (
            <div key={advert.id} style={styles.card}>
              <div style={styles.imageBlock}>
                {advert.image_url ? (
                  <img src={advert.image_url} alt={advert.title} style={styles.image} />
                ) : (
                  <div style={styles.placeholder}>📦</div>
                )}
              </div>
              
              <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>{advert.title}</h3>
                <p style={styles.cardPrice}>{new Intl.NumberFormat('ru-RU').format(advert.price)} ₽</p>
                <p style={{ ...styles.cardStatus, color: statusColors[advert.status] || '#666' }}>
                  {statusLabels[advert.status] || advert.status}
                </p>
              </div>
              
              <div style={styles.cardActions}>
                <Link to={`/advert/${advert.id}`} style={styles.btnView}>👁️</Link>
                
                {advert.status !== 'expired' && advert.status !== 'rejected' && (
                  <Link to={`/edit/${advert.id}`} style={styles.btnEdit}>✏️</Link>
                )}
                
                {advert.status === 'expired' && (
                  <button onClick={() => handleRenew(advert.id)} style={styles.btnRenew} title="Продлить на 30 дней">🔄</button>
                )}

                <button onClick={() => handleDeleteClick(advert.id, advert.status)} style={styles.btnDelete} title="Удалить">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0, color: '#c0392b' }}>⚠️ Удалить объявление?</h2>
            <p>Вы уверены, что хотите удалить <b>активное</b> объявление?</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Оно сейчас видно покупателям. Если вы удалите его, восстановить не получится.</p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModal({ open: false, id: null, status: '' })} style={styles.btnCancel}>Отмена</button>
              <button onClick={() => executeDelete(deleteModal.id)} style={styles.btnConfirmDelete}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fff', flexWrap: 'wrap', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  imageBlock: { width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f0f7fa', flexShrink: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' },
  cardInfo: { flex: '1 1 200px' },
  cardTitle: { margin: '0 0 5px', fontSize: '16px', color: '#1a1a2e' },
  cardPrice: { margin: '0 0 5px', fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' },
  cardStatus: { margin: 0, fontSize: '13px', fontWeight: '500' },
  cardActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  btnView: { padding: '8px 12px', backgroundColor: '#f0f7fa', color: '#1a1a2e', textDecoration: 'none', borderRadius: '6px', fontSize: '16px', border: '1px solid #cceeff' },
  btnEdit: { padding: '8px 12px', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '16px', border: '1px solid #e0e0e0' },
  btnRenew: { padding: '8px 12px', backgroundColor: '#e6ffe6', color: '#008000', border: '1px solid #b3ffb3', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  btnDelete: { padding: '8px 12px', backgroundColor: '#ffe6e6', color: '#cc0000', border: '1px solid #ffcccc', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
  btnCancel: { flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  btnConfirmDelete: { flex: 1, padding: '12px', backgroundColor: '#FF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
};

export default MyAdvertsPage;