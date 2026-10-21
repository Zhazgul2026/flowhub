import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdvert, updateAdvert, getCategories } from '../services/api';
import { getFieldsForCategory, normalizeOptions } from '../utils/categoryFields';
import { getCatalogList } from '../utils/catalogs';
import { CITIES } from '../utils/cities'; // <-- ДОБАВЛЕН ИМПОРТ ГОРОДОВ
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
    city: 'Москва', // <-- ДОБАВЛЕН ГОРОД
    is_wholesale: false,
  });
  const [categoryFields, setCategoryFields] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
    getAdvert(id)
      .then((res) => {
        const a = res.data;
        setForm({
          title: a.title,
          description: a.description,
          price: a.price,
          quantity: a.quantity,
          category: a.category,
          city: a.city || 'Москва', // <-- ПОДТЯГИВАЕМ ГОРОД
          is_wholesale: a.is_wholesale,
        });
        if (a.category_fields && typeof a.category_fields === 'object') {
          setCategoryFields(a.category_fields);
        }
        if (a.image_url) setImagePreview(a.image_url);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleCategoryFieldChange = (name, value) => {
    setCategoryFields((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'vehicle_type') {
        delete updated.brand;
        delete updated.model;
      }
      if (name === 'product_type') {
        delete updated.brand;
      }
      if (name === 'brand') {
        delete updated.model;
      }
      return updated;
    });
  };

  const handleManualChange = (name, value) => {
    setCategoryFields((prev) => ({ ...prev, [`${name}_manual`]: value }));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setForm({ ...form, category: newCategory });
    setCategoryFields({});
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
      formData.append('city', form.city); // <-- ДОБАВЛЕН ГОРОД В ОТПРАВКУ
      formData.append('is_wholesale', form.is_wholesale);
      formData.append('wholesale_conditions', JSON.stringify(
        { prepayment: 0, only_business: false }
      ));

      const cleanFields = { ...categoryFields };
      Object.keys(cleanFields).forEach((key) => {
        if (key.endsWith('_manual')) {
          const base = key.replace('_manual', '');
          if (cleanFields[base] && cleanFields[base] !== '__other__') {
            delete cleanFields[key];
          } else {
            cleanFields[base] = cleanFields[key];
            delete cleanFields[key];
          }
        }
      });

      formData.append('category_fields', JSON.stringify(cleanFields));
      if (image) formData.append('image', image);

      await updateAdvert(id, formData);
      alert('Объявление обновлено и отправлено на модерацию.');
      navigate(`/advert/${id}`);
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n');
        setError(messages);
      } else {
        setError('Ошибка при сохранении.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;

  const dynamicFields = getFieldsForCategory(form.category);

  const renderField = (field) => {
    const value = categoryFields[field.name] || '';

    if (field.type === 'select') {
      const options = normalizeOptions(field.options);
      return (
        <select className="form-input" value={value} onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}>
          <option value="">— Выберите —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'dependent') {
      const filterValue = field.dependsOn ? categoryFields[field.dependsOn] : null;
      const list = getCatalogList(field.catalogKey, filterValue);

      if (field.dependsOn && !filterValue) {
        return (
          <select className="form-input" disabled>
            <option value="">— Сначала выберите предыдущее поле —</option>
          </select>
        );
      }

      const isInList = list.includes(value);
      const isOther = value === '__other__' || (value && !isInList);

      return (
        <>
          <select className="form-input" value={isOther ? '__other__' : value} onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}>
            <option value="">— Выберите —</option>
            {list.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
            <option value="__other__">Другое (ввести вручную)</option>
          </select>

          {isOther && (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '8px' }}
              placeholder="Введите значение"
              value={
                categoryFields[`${field.name}_manual`] ||
                (!isInList ? value : '') ||
                ''
              }
              onChange={(e) => handleManualChange(field.name, e.target.value)}
            />
          )}
        </>
      );
    }

    return (
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        className="form-input"
        placeholder={field.placeholder || ''}
        value={value}
        onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
      />
    );
  };

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

        {/* --- БЛОК ГОРОДА --- */}
        <label className="form-label">Город *</label>
        <select name="city" value={form.city} onChange={handleChange} required className="form-input">
          {CITIES.filter(c => c !== 'Вся Россия').map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="form-label">Категория *</label>
        <select name="category" value={form.category} onChange={handleCategoryChange} required className="form-input">
          <option value="">— Выберите категорию —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {dynamicFields.length > 0 && (
          <div style={styles.dynamicBlock}>
            <h3 style={styles.dynamicTitle}>Характеристики</h3>
            {dynamicFields.map((field) => (
              <div key={field.name} style={{ marginBottom: '12px' }}>
                <label className="form-label">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>
        )}

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
  dynamicBlock: { marginTop: '20px', padding: '16px', borderRadius: '10px', backgroundColor: '#f5f7fa', border: '1px solid #e1e5ea' },
  dynamicTitle: { margin: '0 0 14px 0', fontSize: '16px', fontWeight: 'bold' },
};

export default EditAdvertPage;