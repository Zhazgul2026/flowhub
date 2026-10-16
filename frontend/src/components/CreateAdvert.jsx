import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAdvert, getCategories } from '../services/api';
import { getFieldsForCategory, normalizeOptions } from '../utils/categoryFields';
import { getCatalogList } from '../utils/catalogs';
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
  const [categoryFields, setCategoryFields] = useState({});
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

  const handleCategoryFieldChange = (name, value) => {
    setCategoryFields((prev) => {
      const updated = { ...prev, [name]: value };

      // Если поменялся vehicle_type — сбрасываем brand и model
      if (name === 'vehicle_type') {
        delete updated.brand;
        delete updated.model;
      }
      // Если поменялся product_type (электроника) — сбрасываем brand
      if (name === 'product_type') {
        delete updated.brand;
      }
      // Если поменялся brand — сбрасываем model
      if (name === 'brand') {
        delete updated.model;
      }

      return updated;
    });
  };

  // Ручной ввод, если в каталоге нет (через "Другое")
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

      // Фильтруем category_fields: убираем _manual, если основной выбран
      const cleanFields = { ...categoryFields };
      Object.keys(cleanFields).forEach((key) => {
        if (key.endsWith('_manual')) {
          const base = key.replace('_manual', '');
          if (cleanFields[base] && cleanFields[base] !== 'Другое') {
            delete cleanFields[key];
          } else {
            // Если основное — "Другое" или пусто, используем ручной ввод
            cleanFields[base] = cleanFields[key];
            delete cleanFields[key];
          }
        }
      });

      formData.append('category_fields', JSON.stringify(cleanFields));
      if (image) formData.append('image', image);

      await createAdvert(formData);
      alert('Объявление создано! Оно отправлено на модерацию.');
      navigate('/');
    } catch (err) {
      if (err.response?.status === 403) {
        const errorMsg = err.response.data?.detail || 'Лимит бесплатных объявлений исчерпан.';
        setError(errorMsg);
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

  const isLimitError = error.toLowerCase().includes('лимит');
  const dynamicFields = getFieldsForCategory(form.category);

  // Отрисовка одного поля
  const renderField = (field) => {
    const value = categoryFields[field.name] || '';

    // === SELECT ===
    if (field.type === 'select') {
      const options = normalizeOptions(field.options);
      return (
        <select
          className="form-input"
          value={value}
          onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
        >
          <option value="">— Выберите —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    // === DEPENDENT (зависимый селект) ===
    if (field.type === 'dependent') {
      const filterValue = field.dependsOn ? categoryFields[field.dependsOn] : null;
      const list = getCatalogList(field.catalogKey, filterValue);

      // Если зависит от чего-то, а родитель ещё не выбран — блокируем
      if (field.dependsOn && !filterValue) {
        return (
          <select className="form-input" disabled>
            <option value="">— Сначала выберите предыдущее поле —</option>
          </select>
        );
      }

      const isOther = value === '__other__';
      return (
        <>
          <select
            className="form-input"
            value={isOther ? '__other__' : value}
            onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
          >
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
              value={categoryFields[`${field.name}_manual`] || ''}
              onChange={(e) => handleManualChange(field.name, e.target.value)}
            />
          )}
        </>
      );
    }

    // === TEXT / NUMBER ===
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
      <BackButton text="Отменить" to="/" />

      <h1 className="form-title">➕ Подать объявление</h1>
      <p className="form-subtitle">
        Объявление появится на сайте после проверки администратором
      </p>

      {error && (
        <div className="form-error">
          {error}
          {isLimitError && (
            <div style={{ marginTop: '10px' }}>
              <Link to="/pricing" style={{ color: '#00F0FF', fontWeight: 'bold', textDecoration: 'underline' }}>
                👉 Посмотреть тарифы
              </Link>
            </div>
          )}
        </div>
      )}

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
          onChange={handleCategoryChange}
          required
          className="form-input"
        >
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
  dynamicBlock: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: '#f5f7fa',
    border: '1px solid #e1e5ea',
  },
  dynamicTitle: {
    margin: '0 0 14px 0',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default CreateAdvert;