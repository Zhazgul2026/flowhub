import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdvert, createChat, deleteAdvert } from '../services/api';
import BackButton from './BackButton';

function AdvertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advert, setAdvert] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const isLoggedIn = !!localStorage.getItem('access_token');
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    getAdvert(id).then((res) => setAdvert(res.data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleContact = async () => {
    if (!isLoggedIn) {
      alert('Чтобы связаться с продавцом — войдите или зарегистрируйтесь');
      navigate('/login');
      return;
    }
    if (advert.user_username === currentUser) {
      alert('Это ваше объявление. Вы не можете писать самому себе.');
      return;
    }
    setStartingChat(true);
    try {
      const res = await createChat(advert.id);
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      alert('Ошибка при создании чата');
    } finally {
      setStartingChat(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить объявление? Это действие нельзя отменить.')) return;
    try {
      await deleteAdvert(advert.id);
      alert('Объявление удалено');
      navigate('/');
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${advert.id}`);
  };

  if (!advert) return <p style={{ padding: '20px' }}>Загрузка...</p>;

  const isOwner = advert.user_username === currentUser;
  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '20px auto 0', padding: '0 20px' }}>
        <BackButton text="Назад к объявлениям" to="/" />
      </div>

      <div className="advert-detail">
        <div className="advert-image-block">
          {advert.image_url ? (
            <img
              src={advert.image_url}
              alt={advert.title}
              className="advert-image"
              onClick={() => setLightbox(true)}
            />
          ) : (
            <div className="advert-image-placeholder">📦</div>
          )}
          {advert.is_wholesale && <span className="advert-wholesale-badge">ОПТ</span>}
        </div>

        <div className="advert-content">
          <h1 className="advert-title">{advert.title}</h1>
          <p className="advert-price">{formatPrice(advert.price)} ₽</p>
          {advert.quantity > 1 && (
            <p className="advert-quantity">В наличии: {advert.quantity} шт.</p>
          )}
          <p className="advert-category">Категория: {advert.category_name || '—'}</p>

          <div className="advert-block">
            <h3 className="advert-section-title">Описание</h3>
            <p className="advert-description">{advert.description}</p>
          </div>

          {advert.is_wholesale && (
            <div className="advert-wholesale-block">
              <h3>Оптовое предложение</h3>
              <p>Доступно для верифицированных пользователей и бизнеса.</p>
              {advert.wholesale_conditions && (
                <ul className="advert-wholesale-list">
                  <li>Предоплата: {advert.wholesale_conditions.prepayment}%</li>
                  <li>
                    {advert.wholesale_conditions.only_business
                      ? 'Только для бизнеса'
                      : 'Доступно и частным лицам'}
                  </li>
                </ul>
              )}
            </div>
          )}

          <div className="advert-seller">
            <h3 className="advert-section-title">Продавец</h3>
            <p className="advert-seller-name">👤 {advert.user_username}</p>
            {isOwner ? (
              <div style={styles.ownerActions}>
                <button onClick={handleEdit} style={styles.editButton}>
                  ✏️ Редактировать
                </button>
                <button onClick={handleDelete} style={styles.deleteButton}>
                  🗑️ Удалить
                </button>
              </div>
            ) : (
              <button
                onClick={handleContact}
                disabled={startingChat}
                className="advert-contact-button"
              >
                {startingChat ? 'Открываем чат...' : '💬 Связаться с продавцом'}
              </button>
            )}
          </div>
        </div>

        {lightbox && advert.image_url && (
          <div className="advert-lightbox" onClick={() => setLightbox(false)}>
            <button
              className="advert-lightbox-close"
              onClick={() => setLightbox(false)}
            >✕</button>
            <img
              src={advert.image_url}
              alt={advert.title}
              className="advert-lightbox-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  ownerActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  editButton: {
    flex: 1,
    minWidth: '140px',
    padding: '14px',
    backgroundColor: '#00F0FF',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
  },
  deleteButton: {
    flex: 1,
    minWidth: '140px',
    padding: '14px',
    backgroundColor: '#FF4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
  },
};

export default AdvertDetail;