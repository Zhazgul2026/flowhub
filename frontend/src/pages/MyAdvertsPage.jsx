import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyAdverts, deleteAdvert, renewAdvert } from '../services/api';
import BackButton from '../components/BackButton';

function MyAdvertsPage() {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, status: '' });
  const navigate = useNavigate();

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
    // Если на модерации или отклонено — удаляем сразу (или с легким подтверждением)
    if (status === 'moderation' || status === 'rejected') {
      if (window.confirm('Удалить это объявление? Оно ещё не опубликовано.')) {
        executeDelete(id);
      }
    } else {
      // Если активно или продано — показываем страшное модальное окно
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
      <h1 className="form-title" style={{ marginBottom: '20px' }}>📋 Мои объявления</h1>

      {adverts.length === 0 ? (
        <p>У вас пока нет объявлений. <Link to="/create">Создать первое</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {adverts.map((advert) => (
            <div key={advert.id} style={styles.card}>
              <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>{advert.title}</h3>
                <p style={styles.cardPrice}>{new Intl.NumberFormat('ru-RU').format(advert.price)} ₽</p>
                <p style={styles.cardStatus}>{statusLabels[advert.status] || advert.status}</p>
              </div>
              
              <div style={styles.cardActions}>
                <Link to={`/advert/${advert.id}`} style={styles.btnView}>👁️ Открыть</Link>
                
                {advert.status !== 'expired' && advert.status !== 'rejected' && (
                  <Link to={`/edit/${advert.id}`} style={styles.btnEdit}>✏️ Ред.</Link>
                )}
                
                {advert.status === 'expired' && (
                  <button onClick={() => handleRenew(advert.id)} style={styles.btnRenew}>🔄 Продлить</button>
                )}

                <button onClick={() => handleDeleteClick(advert.id, advert.status)} style={styles.btnDelete}>🗑️ Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО УДАЛЕНИЯ */}
      {deleteModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0, color: '#c0392b' }}>⚠️ Удалить объявление?</h2>
            <p>Вы уверены, что хотите удалить <b>активное</b> объявление?</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Оно сейчас видно покупателям. Если вы удалите его, восстановить не получится.
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModal({ open: false, id: null, status: '' })} style={styles.btnCancel}>
                Отмена
              </button>
              <button onClick={() => executeDelete(deleteModal.id)} style={styles.btnConfirmDelete}>
                Да, удалить навсегда
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', flexWrap: 'wrap', gap: '15px' },
  cardInfo: { flex: '1 1 300px' },
  cardTitle: { margin: '0 0 5px', fontSize: '18px' },
  cardPrice: { margin: '0 0 5px', fontWeight: 'bold', fontSize: '16px' },
  cardStatus: { margin: 0, fontSize: '14px', color: '#666' },
  cardActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  btnView: { padding: '8px 12px', backgroundColor: '#e6f7ff', color: '#0066cc', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' },
  btnEdit: { padding: '8px 12px', backgroundColor: '#f0f0f0', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' },
  btnRenew: { padding: '8px 12px', backgroundColor: '#e6ffe6', color: '#008000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnDelete: { padding: '8px 12px', backgroundColor: '#ffe6e6', color: '#cc0000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
  btnCancel: { flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  btnConfirmDelete: { flex: 1, padding: '12px', backgroundColor: '#FF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
};

export default MyAdvertsPage;