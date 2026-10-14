import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdvert, getCategories } from '../services/api';
import BackButton from './BackButton';

function CreateAdvert() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    category: '',
    is_wholesale: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Чтобы подать объявление — войдите или зарегистрируйтесь');
      navigate('/login');
      return;
    }
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимум 5 МБ.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('quantity', form.quantity);
      formData.append('category', form.category);
      formData.append('is_wholesale', form.is_wholesale);
      formData.append('wholesale_conditions', JSON.stringify(
        { prepayment: 0, only_business: false }
      ));
      if (image) {
        formData.append('image', image);
      }

      await createAdvert(formData);
      alert('Объявление создано! Оно отправлено на модерацию.');
      navigate('/');
        } catch (err) {
      if (err.response?.status === 403) {
        const errorMsg = err.response.data?.detail || 'Лимит бесплатных объявлений исчерпан.';
        setError(errorMsg + '\n\nКупите пакет для публикации дополнительных объявлений.');
      } else if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n');
        setError(messages);
      } else {
        setError('Ошибка при создании. Возможно, вы не авторизованы.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <BackButton text="Отменить" to="/" />

      <h1 className="form-title">➕ Подать объявление</h1>
      <p className="form-subtitle">
        Объявление появится на сайте после проверки администратором
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Название *</label>
        <input
          name="title"
          placeholder="Например: iPhone 15 Pro, 256 ГБ"
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Описание *</label>
        <textarea
          name="description"
          placeholder="Состояние, комплектация, детали..."
          onChange={handleChange}
          required
          rows="5"
          className="form-input"
          style={{ resize: 'vertical' }}
        />

        <label className="form-label">Фото товара</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
          style={{ border: '1px dashed #aaa', backgroundColor: '#fafafa' }}
        />
        {imagePreview && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <img
              src={imagePreview}
              alt="Превью"
              style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={() => { setImage(null); setImagePreview(null); }}
              style={{ display: 'block', margin: '8px auto 0', padding: '6px 14px', backgroundColor: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
            >
              Удалить фото
            </button>
          </div>
        )}

        <div style={styles.row}>
          <div style={styles.col}>
            <label className="form-label">Цена, ₽ *</label>
            <input
              name="price"
              type="number"
              placeholder="89990"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div style={styles.col}>
            <label className="form-label">Количество</label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <label className="form-label">Категория *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">— Выберите категорию —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label style={styles.checkboxLabel}>
          <input
            name="is_wholesale"
            type="checkbox"
            checked={form.is_wholesale}
            onChange={handleChange}
          />
          Оптовое предложение
        </label>

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Отправка...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  row: { display: 'flex', gap: '15px' },
  col: { flex: 1, display: 'flex', flexDirection: 'column' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', fontSize: '14px', cursor: 'pointer' },
};

export default CreateAdvert;