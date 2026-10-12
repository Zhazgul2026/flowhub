import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdvert, updateAdvert, getCategories } from '../services/api';
import BackButton from '../components/BackButton';

function EditAdvertPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
    getAdvert(id).then((res) => {
      const a = res.data;
      setForm({
        title: a.title,
        description: a.description,
        price: a.price,
        quantity: a.quantity,
        category: a.category,
        is_wholesale: a.is_wholesale,
      });
      if (a.image_url) setImagePreview(a.image_url);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

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
    setSaving(true);

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
      if (image) formData.append('image', image);

      await updateAdvert(id, formData);
      alert('Объявление обновлено и отправлено на модерацию.');
      navigate(`/advert/${id}`);
    } catch (err) {
      setError('Ошибка при сохранении.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;

  return (
    <div className="form-container">
      <BackButton text="Отменить" to={`/advert/${id}`} />

      <h1 className="form-title">✏️ Редактировать объявление</h1>
      <p className="form-subtitle">После сохранения объявление снова уйдёт на модерацию</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Название *</label>
        <input name="title" value={form.title} onChange={handleChange} required className="form-input" />

        <label className="form-label">Описание *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows="5" className="form-input" style={{ resize: 'vertical' }} />

        <label className="form-label">Фото товара</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ border: '1px dashed #aaa', backgroundColor: '#fafafa' }} />
        {imagePreview && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <img src={imagePreview} alt="Превью" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }} />
          </div>
        )}

        <div style={styles.row}>
          <div style={styles.col}>
            <label className="form-label">Цена, ₽ *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="form-input" />
          </div>
          <div style={styles.col}>
            <label className="form-label">Количество</label>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className="form-input" />
          </div>
        </div>

        <label className="form-label">Категория *</label>
        <select name="category" value={form.category} onChange={handleChange} required className="form-input">
          <option value="">— Выберите категорию —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label style={styles.checkboxLabel}>
          <input name="is_wholesale" type="checkbox" checked={form.is_wholesale} onChange={handleChange} />
          Оптовое предложение
        </label>

        <button type="submit" disabled={saving} className="form-button">
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
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

export default EditAdvertPage;