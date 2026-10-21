import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdvert, createChat, deleteAdvert } from '../services/api';
import { getFieldsForCategory } from '../utils/categoryFields';
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
  
  const fieldsSchema = getFieldsForCategory(advert.category);
  const categoryFields = advert.category_fields || {};

  // Формируем пары {label, value} для отображения
  const characteristicsList = fieldsSchema
    .map((field) => {
      const raw = categoryFields[field.name];
      if (raw === undefined || raw === null || raw === '') return null;

      let displayValue = raw;
      if (raw === '__other__') {
        const manual = categoryFields[`${field.name}_manual`];
        if (!manual) return null;
        displayValue = manual;
      }

      if (field.type === 'select' && Array.isArray(field.options)) {
        const opt = field.options.find(
          (o) => (typeof o === 'object' ? o.value : o) === raw
        );
        if (opt && typeof opt === 'object') displayValue = opt.label;
      }

      return { label: field.label, value: displayValue, name: field.name };
    })
    .filter(Boolean);

  const vinField = characteristicsList.find(f => f.name === 'vin');

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '20px auto 0', padding: '0 20px' }}>
        <BackButton text="Назад к объявлениям" to="/" />
      </div>

      <div className="advert-detail">
        <div className="advert-image-block">
          {advert.image_url ? (
            <img src={advert.image_url} alt={advert.title} className="advert-image" onClick={() => setLightbox(true)} />
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
          <p className="advert-category">📍 {advert.city || 'Город не указан'} • Категория: {advert.category_name || '—'}</p>

          <div className="advert-block">
            <h3 className="advert-section-title">Описание</h3>
            <p className="advert-description">{advert.description}</p>
          </div>

          {characteristicsList.length > 0 && (
            <div className="advert-block">
              <h3 className="advert-section-title">Характеристики</h3>
              <div style={styles.specs}>
                {characteristicsList.map(({ label, value }) => (
                  <div key={label} style={styles.specRow}>
                    <span style={styles.specLabel}>{label}</span>
                    <span style={styles.specDots} />
                    <span style={styles.specValue}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Блок проверки авто по VIN */}
          {vinField && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f7fa', borderRadius: '10px', border: '1px solid #cceeff' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px' }}>🚗 Проверка истории автомобиля</h3>
              <p style={{ margin: '0 0 10px', fontSize: '14px' }}>VIN: <b>{vinField.value}</b></p>
              <a 
                href={`https://гибдд.рф/check/auto#${vinField.value}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0066cc', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
              >
                🔍 Проверить на ГИБДД
              </a>
            </div>
          )}

          {advert.is_wholesale && (
            <div className="advert-wholesale-block">
              <h3>Оптовое предложение</h3>
              <p>Доступно для верифицированных пользователей и бизнеса.</p>
              {advert.wholesale_conditions && (
                <ul className="advert-wholesale-list">
                  <li>Предоплата: {advert.wholesale_conditions.prepayment}%</li>
                  <li>{advert.wholesale_conditions.only_business ? 'Только для бизнеса' : 'Доступно и частным лицам'}</li>
                </ul>
              )}
            </div>
          )}

          <div className="advert-seller">
            <h3 className="advert-section-title">Продавец</h3>
            <p className="advert-seller-name">👤 {advert.user_username}</p>
            {isOwner ? (
              <div style={styles.ownerActions}>
                <button onClick={handleEdit} style={styles.editButton}>✏️ Редактировать</button>
                <button onClick={handleDelete} style={styles.deleteButton}>🗑️ Удалить</button>
              </div>
            ) : (
              <button onClick={handleContact} disabled={startingChat} className="advert-contact-button">
                {startingChat ? 'Открываем чат...' : '💬 Связаться с продавцом'}
              </button>
            )}
          </div>

          {/* ЮРИДИЧЕСКИЙ ДИСКЛЕЙМЕР */}
          <div style={styles.disclaimer}>
            <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '5px' }}>⚠️ Важная информация</p>
            <p style={{ margin: 0 }}>
              Администрация сайта не несёт ответственности за полноту и достоверность сведений, указанных в объявлениях.
              Информацию о недвижимости можно проверить в Росреестре или МФЦ. Сведения о транспортных средствах — на официальном сайте ГИБДД. 
              Мы также не несём ответственности за переходы на сторонние мессенджеры.
            </p>
          </div>

        </div>

        {lightbox && advert.image_url && (
          <div className="advert-lightbox" onClick={() => setLightbox(false)}>
            <button className="advert-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
            <img src={advert.image_url} alt={advert.title} className="advert-lightbox-image" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  ownerActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  editButton: { flex: 1, minWidth: '140px', padding: '14px', backgroundColor: '#00F0FF', color: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', fontFamily: 'inherit', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' },
  deleteButton: { flex: 1, minWidth: '140px', padding: '14px', backgroundColor: '#FF4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', fontFamily: 'inherit' },
  specs: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' },
  specRow: { display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '15px' },
  specLabel: { color: '#666', whiteSpace: 'nowrap' },
  specDots: { flex: 1, borderBottom: '1px dotted #ccc', marginBottom: '3px', minWidth: '20px' },
  specValue: { fontWeight: '500', textAlign: 'right', color: '#1a1a2e' },
  disclaimer: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '12px', color: '#888', lineHeight: '1.5' }
};

export default AdvertDetail;