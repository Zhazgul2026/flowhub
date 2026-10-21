import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getAdverts, getCategories, getFavorites, addFavorite, removeFavorite } from '../services/api';
import { CITIES } from '../utils/cities';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для избранного
  const [favorites, setFavorites] = useState([]); // Массив объектов избранного
  const isLoggedIn = !!localStorage.getItem('access_token');

  const searchFromUrl = searchParams.get('search') || '';

  const [selectedCity, setSelectedCity] = useState('Вся Россия');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [onlyWholesale, setOnlyWholesale] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
    if (isLoggedIn) {
      getFavorites().then((res) => setFavorites(res.data)).catch(console.error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (onlyWholesale) params.is_wholesale = true;
    if (searchFromUrl) params.search = searchFromUrl;
    if (priceMin) params.price_min = priceMin;
    if (priceMax) params.price_max = priceMax;
    if (selectedCity && selectedCity !== 'Вся Россия') params.city = selectedCity;

    getAdverts(params)
      .then((res) => setAdverts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, onlyWholesale, searchFromUrl, priceMin, priceMax, selectedCity]);

  // Логика добавления/удаления из избранного
  const toggleFavorite = async (e, advertId) => {
    e.preventDefault(); // Чтобы не переходить по ссылке карточки
    if (!isLoggedIn) {
      alert('Войдите, чтобы добавлять в избранное');
      return navigate('/login');
    }

    const existingFav = favorites.find(f => f.advert.id === advertId);

    try {
      if (existingFav) {
        // Удаляем
        await removeFavorite(existingFav.id);
        setFavorites(favorites.filter(f => f.id !== existingFav.id));
      } else {
        // Добавляем
        const res = await addFavorite(advertId);
        setFavorites([...favorites, res.data]);
      }
    } catch (err) {
      alert('Ошибка при работе с избранным');
    }
  };

  const sortedAdverts = [...adverts].sort((a, b) => {
    if (sortBy === 'price_asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setOnlyWholesale(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = !!(selectedCategory || searchFromUrl || priceMin || priceMax || onlyWholesale || selectedCity !== 'Вся Россия');

  const categoryIcons = {
    'Недвижимость': '🏠', 'Транспорт': '🚗', 'Электроника': '📱',
    'Одежда и обувь': '👕', 'Дом и сад': '🏡', 'Работа и услуги': '💼',
    'Животные': '🐾', 'Хобби и отдых': '🎨', 'Коллекции и антиквариат': '🏺',
  };

  const getSmartPreview = (advert) => {
    const fields = advert.category_fields || {};
    const parts = [];
    const catId = advert.category;

    if (catId === 2) {
      if (fields.brand && fields.model) parts.push(`${fields.brand} ${fields.model}`);
      if (fields.year) parts.push(fields.year);
      if (fields.mileage) parts.push(`${new Intl.NumberFormat('ru-RU').format(fields.mileage)} км`);
    } else if (catId === 1) {
      if (fields.rooms) parts.push(`${fields.rooms}-комн.`);
      if (fields.area) parts.push(`${fields.area} м²`);
      if (fields.floor) parts.push(`${fields.floor} эт.`);
    } else if (catId === 3) {
      if (fields.brand) parts.push(fields.brand);
      if (fields.model) parts.push(fields.model);
      if (fields.condition) parts.push(fields.condition);
    } else {
      const vals = Object.values(fields).filter(v => v && v !== '__other__' && v !== '_manual');
      parts.push(...vals.slice(0, 3));
    }

    if (parts.length === 0) return advert.category_name || 'Без категории';
    return parts.join(' • ');
  };

  return (
    <div className="page-container">
      <div className="hero">
        <h1 className="hero-title">ЗипТап</h1>
        <p className="hero-text">Поток сделок. Центр притяжения.</p>
        <Link to="/create" className="hero-button">Подать объявление</Link>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Категории</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
              className="category-card"
              style={{
                borderColor: selectedCategory === cat.id ? '#00F0FF' : '#e0e0e0',
                backgroundColor: selectedCategory === cat.id ? '#e6f7ff' : '#fff',
                boxShadow: selectedCategory === cat.id ? '0 0 15px rgba(0, 240, 255, 0.5)' : 'none',
              }}
            >
              <span className="category-icon">{categoryIcons[cat.name] || '📦'}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Объявления</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📍</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ padding: '10px 15px', borderRadius: '8px', border: '2px solid #00F0FF', fontSize: '16px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="layout-grid">
          <aside className="sidebar">
            <h3 style={styles.filterTitle}>🔧 Фильтры</h3>
            <label style={styles.label}>Категория</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.input}>
              <option value="">Все категории</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label style={styles.label}>Цена, ₽</label>
            <div style={styles.priceRow}>
              <input type="number" placeholder="от" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={styles.priceInput} />
              <input type="number" placeholder="до" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={styles.priceInput} />
            </div>

            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={onlyWholesale} onChange={(e) => setOnlyWholesale(e.target.checked)} />
              Только опт
            </label>

            <div style={styles.buttonsRow}>
              <button onClick={resetFilters} style={{ ...styles.resetButton, backgroundColor: hasActiveFilters ? '#00F0FF' : '#f0f0f0', color: hasActiveFilters ? '#1a1a2e' : '#666', fontWeight: hasActiveFilters ? 'bold' : 'normal' }}>
                Сбросить фильтры {hasActiveFilters ? '✓' : ''}
              </button>
            </div>
          </aside>

          <main style={styles.main}>
            <div style={styles.topBar}>
              <span>Найдено: <b>{sortedAdverts.length}</b></span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                <option value="newest">Сначала новые</option>
                <option value="price_asc">Цена: по возрастанию</option>
                <option value="price_desc">Цена: по убыванию</option>
              </select>
            </div>

            {loading ? (
              <p>Загрузка...</p>
            ) : sortedAdverts.length === 0 ? (
              <p>Ничего не найдено. Попробуйте изменить фильтры или выбрать другой город.</p>
            ) : (
              <div className="adverts-grid">
                {sortedAdverts.map((advert) => {
                  const isFav = favorites.some(f => f.advert.id === advert.id);
                  return (
                    <Link key={advert.id} to={`/advert/${advert.id}`} style={styles.card}>
                      <div style={{ position: 'relative' }}>
                        {advert.image_url ? (
                          <img src={advert.image_url} alt={advert.title} style={styles.cardImage} />
                        ) : (
                          <div style={styles.imagePlaceholder}>📦</div>
                        )}
                        {/* Кнопка сердечка */}
                        <button 
                          onClick={(e) => toggleFavorite(e, advert.id)}
                          style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title={isFav ? 'Убрать из избранного' : 'В избранное'}
                        >
                          {isFav ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <div style={styles.cardBody}>
                        <h3 style={styles.cardTitle}>{advert.title}</h3>
                        <p style={styles.cardPrice}>{formatPrice(advert.price)} ₽</p>
                        <p style={styles.cardCategory}>{getSmartPreview(advert)}</p>
                        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 10px' }}>📍 {advert.city || 'Не указан'}</p>
                        <div style={styles.cardFooter}>
                          <span>👤 {advert.user_username}</span>
                          <span>{formatDate(advert.created_at)}</span>
                        </div>
                        {advert.is_wholesale && <span style={styles.wholesaleBadge}>ОПТ</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>

      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>Как это работает</h2>
        <div style={styles.howGrid}>
          <div style={styles.howCard}><div style={styles.howIcon}>1️⃣</div><h3 style={styles.howTitle}>Зарегистрируйтесь</h3><p style={styles.howText}>Создайте бесплатный аккаунт за 30 секунд.</p></div>
          <div style={styles.howCard}><div style={styles.howIcon}>2️⃣</div><h3 style={styles.howTitle}>Подайте объявление</h3><p style={styles.howText}>Загрузите фото, укажите цену, город и описание.</p></div>
          <div style={styles.howCard}><div style={styles.howIcon}>3️⃣</div><h3 style={styles.howTitle}>Общайтесь в чате</h3><p style={styles.howText}>Отвечайте покупателям прямо на сайте.</p></div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div><h3 style={styles.footerTitle}>ЗипТап</h3><p style={styles.footerText}>Поток сделок. Центр притяжения.</p></div>
          <div><h4 style={styles.footerHeading}>Разделы</h4><Link to="/" style={styles.footerLink}>Главная</Link><Link to="/create" style={styles.footerLink}>Подать объявление</Link></div>
          <div><h4 style={styles.footerHeading}>О проекте</h4><p style={styles.footerText}>Честная торговля для всех.</p></div>
        </div>
        <div style={styles.footerBottom}>© 2026 ЗипТап. Все права защищены.</div>
      </footer>
    </div>
  );
}

const styles = {
  section: { marginBottom: '50px' },
  sectionTitle: { fontSize: '28px', marginBottom: '20px', color: '#1a1a2e' },
  filterTitle: { margin: '0 0 15px', fontSize: '20px' },
  label: { display: 'block', fontSize: '13px', color: '#666', margin: '12px 0 5px' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  priceRow: { display: 'flex', gap: '8px' },
  priceInput: { width: '50%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', margin: '15px 0', fontSize: '14px', cursor: 'pointer' },
  buttonsRow: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' },
  resetButton: { width: '100%', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', fontFamily: 'inherit' },
  main: { minWidth: 0 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '14px', color: '#666', flexWrap: 'wrap', gap: '10px' },
  sortSelect: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  card: { backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: '#333', position: 'relative', display: 'flex', flexDirection: 'column' },
  cardImage: { width: '100%', height: '150px', objectFit: 'cover' },
  imagePlaceholder: { backgroundColor: '#f0f7fa', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
  cardBody: { padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '15px', margin: '0 0 8px', minHeight: '38px', overflow: 'hidden' },
  cardPrice: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 5px' },
  cardCategory: { fontSize: '13px', color: '#444', margin: '0 0 5px', fontWeight: '500' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: 'auto' },
  wholesaleBadge: { position: 'absolute', top: '8px', right: '8px', backgroundColor: '#00F0FF', color: '#1a1a2e', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' },
  howSection: { marginBottom: '50px', padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  howCard: { textAlign: 'center', padding: '20px' },
  howIcon: { fontSize: '40px', marginBottom: '10px' },
  howTitle: { fontSize: '18px', margin: '0 0 8px', color: '#1a1a2e' },
  howText: { fontSize: '14px', color: '#666', lineHeight: '1.5' },
  footer: { marginTop: '60px', padding: '30px 20px 15px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '12px' },
  footerContent: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '20px' },
  footerTitle: { margin: '0 0 10px', color: '#00F0FF' },
  footerHeading: { fontSize: '15px', margin: '0 0 10px', color: '#00F0FF' },
  footerText: { fontSize: '13px', color: '#ccc', margin: '0 0 8px' },
  footerLink: { display: 'block', color: '#fff', textDecoration: 'none', fontSize: '13px', marginBottom: '6px' },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '15px', fontSize: '12px', color: '#aaa', textAlign: 'center' },
};

export default HomePage;