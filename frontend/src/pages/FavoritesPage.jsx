import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import BackButton from '../components/BackButton';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    setLoading(true);
    getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (err) {
      alert('Ошибка при удалении из избранного');
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <BackButton text="На главную" to="/" />
      <h1 className="form-title">❤️ Избранное</h1>

      {favorites.length === 0 ? (
        <p>У вас пока нет избранных объявлений. <Link to="/">Посмотреть объявления</Link></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {favorites.map((fav) => {
            const advert = fav.advert; // Сюда бэкенд вложит объект объявления
            return (
              <div key={fav.id} style={styles.card}>
                <Link to={`/advert/${advert.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  {advert.image_url ? (
                    <img src={advert.image_url} alt={advert.title} style={styles.image} />
                  ) : (
                    <div style={styles.placeholder}>📦</div>
                  )}
                  <div style={styles.body}>
                    <h3 style={styles.title}>{advert.title}</h3>
                    <p style={styles.price}>{formatPrice(advert.price)} ₽</p>
                  </div>
                </Link>
                <button onClick={() => handleRemove(fav.id)} style={styles.btnRemove}>
                  🗑️ Удалить
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  image: { width: '100%', height: '150px', objectFit: 'cover' },
  placeholder: { backgroundColor: '#f0f7fa', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
  body: { padding: '12px' },
  title: { fontSize: '15px', margin: '0 0 8px' },
  price: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px' },
  btnRemove: { margin: '0 12px 12px', padding: '8px', backgroundColor: '#ffe6e6', color: '#cc0000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
};

export default FavoritesPage;