import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdvert, getCategories } from '../services/api';

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
        form.is_wholesale
          ? { prepayment: 0, only_business: false }
          : { prepayment: 0, only_business: false }
      ));
      if (image) {
        formData.append('image', image);
      }

      await createAdvert(formData);
      alert('Объявление создано! Оно отправлено на модерацию.');
      navigate('/');
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join('\n');
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
      <h1 style={styles.title}>Подать объявление</h1>
      <p style={styles.subtitle}>
        Объявление появится на сайте после проверки администратором
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label style={styles.label}>Название *</label>
        <input
          name="title"
          placeholder="Например: iPhone 15 Pro, 256 ГБ"
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Описание *</label>
        <textarea
          name="description"
          placeholder="Состояние, комплектация, детали..."
          onChange={handleChange}
          required
          rows="5"
          style={styles.textarea}
        />

        <label style={styles.label}>Фото товара</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        {imagePreview && (
          <div style={styles.previewBox}>
            <img src={imagePreview} alt="Превью" style={styles.preview} />
            <button
              type="button"
              onClick={() => { setImage(null); setImagePreview(null); }}
              style={styles.removeImage}
            >
              Удалить фото
            </button>
          </div>
        )}

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Цена, ₽ *</label>
            <input
              name="price"
              type="number"
              placeholder="89990"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Количество</label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <label style={styles.label}>Категория *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={styles.input}
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

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Отправка...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 5px', fontSize: '28px', color: '#0b3b4a' },
  subtitle: { margin: '0 0 20px', color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', color: '#666', marginTop: '12px', marginBottom: '4px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', fontFamily: 'inherit' },
  textarea: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical' },
  fileInput: { padding: '10px', borderRadius: '6px', border: '1px dashed #aaa', fontSize: '14px', backgroundColor: '#fafafa' },
  previewBox: { marginTop: '10px', textAlign: 'center' },
  preview: { maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  removeImage: { marginTop: '8px', padding: '6px 14px', backgroundColor: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  row: { display: 'flex', gap: '15px' },
  col: { flex: 1, display: 'flex', flexDirection: 'column' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', fontSize: '14px', cursor: 'pointer' },
  button: { marginTop: '25px', backgroundColor: '#0b3b4a', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', whiteSpace: 'pre-line' },
};

export default CreateAdvert;