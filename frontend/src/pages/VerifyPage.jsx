import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BackButton from '../components/BackButton';

function VerifyPage() {
  const [type, setType] = useState('verified_private');
  const [passport, setPassport] = useState('');
  const [inn, setInn] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'verified_private') {
        await api.post('/auth/verify-passport/', { passport_data: passport });
      } else {
        const formData = new FormData();
        formData.append('business_docs', file);
        formData.append('inn', inn);
        await api.post('/auth/verify-business/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError('Ошибка верификации. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-container">
        <h1 className="form-title">✅ Верификация пройдена!</h1>
        <p className="form-subtitle">Через 2 секунды вы вернётесь в профиль.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <BackButton text="На главную" to="/" />

      <h1 className="form-title">✅ Верификация</h1>
      <p className="form-subtitle">
        Для работы с оптом нужна верификация. Выберите тип аккаунта:
      </p>

      {error && <div className="form-error">{error}</div>}

      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => setType('verified_private')}
          style={{
            ...styles.tab,
            ...(type === 'verified_private' ? styles.tabActive : {}),
          }}
        >
          👤 Частник
        </button>
        <button
          type="button"
          onClick={() => setType('entrepreneur')}
          style={{
            ...styles.tab,
            ...(type === 'entrepreneur' ? styles.tabActive : {}),
          }}
        >
          🏢 ИП / Юрлицо
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {type === 'verified_private' ? (
          <>
            <label className="form-label">Паспортные данные *</label>
            <input
              type="text"
              placeholder="Серия, номер, кем выдан"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              required
              className="form-input"
            />
            <p style={styles.hint}>
              ⚡ Лимит оптовых покупок: до 100 000 ₽ за сделку.
            </p>
          </>
        ) : (
          <>
            <label className="form-label">ИНН *</label>
            <input
              type="text"
              placeholder="1234567890"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              required
              className="form-input"
            />

            <label className="form-label">Документы (ЕГРИП/ЕГРЮЛ) *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="form-input"
            />
            <p style={styles.hint}>
              ⚡ Без ограничений по сумме, отсрочка платежа, эксклюзивные условия.
            </p>
          </>
        )}

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Отправка...' : 'Пройти верификацию'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: { flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', fontFamily: 'inherit', transition: 'all 0.2s' },
  tabActive: { backgroundColor: '#e6f7ff', borderColor: '#00F0FF', color: '#1a1a2e', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)' },
  hint: { fontSize: '13px', color: '#666', marginTop: '10px', fontStyle: 'italic' },
};

export default VerifyPage;