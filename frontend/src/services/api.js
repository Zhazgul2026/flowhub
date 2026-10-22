import axios from 'axios';

const API_URL = 'https://ziptap-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && token.length > 50) {  // валидный JWT длиннее 50 символов
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если 401 — токен невалидный, чистим
    if (error.response && error.response.status === 401) {
      console.warn('Токен невалидный, очищаем...');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
    }
    return Promise.reject(error);
  }
);

export default api;

// Авторизация
export const register = (data) => api.post('/auth/register/', data);
export const login = (data) => api.post('/auth/login/', data);
export const getProfile = () => api.get('/auth/me/');

// Объявления
export const getAdverts = (params) => api.get('/adverts/', { params });
export const getMyAdverts = () => api.get('/adverts/my/');
export const getAdvert = (id) => api.get(`/adverts/${id}/`);
export const getCategories = () => api.get('/adverts/categories/');

export const createAdvert = (data) => {
  const isFormData = data instanceof FormData;
  return api.post('/adverts/', data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
};

export const updateAdvert = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.patch(`/adverts/${id}/`, data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
};

export const deleteAdvert = (id) => api.delete(`/adverts/${id}/`);
export const renewAdvert = (id) => api.post(`/adverts/${id}/renew/`);
export const boostAdvert = (id) => api.post(`/adverts/${id}/boost/`);

// Опт
export const getWholesaleOrders = () => api.get('/wholesale/orders/');
export const createWholesaleRequest = (data) => api.post('/wholesale/requests/', data);
export const depositEscrow = (orderId) => api.post(`/wholesale/escrow/deposit/${orderId}/`);
export const confirmEscrow = (orderId) => api.post(`/wholesale/escrow/confirm/${orderId}/`);
export const disputeOrder = (orderId) => api.post(`/wholesale/escrow/dispute/${orderId}/`);

// Модерация
export const checkText = (text) => api.post('/moderation/check-text/', { text });

// Чат
export const getChats = () => api.get('/chats/');
export const getChat = (id) => api.get(`/chats/${id}/`);
export const createChat = (advertId) => api.post('/chats/', { advert: advertId });
export const sendMessage = (chatId, data) => {
  const isFormData = data instanceof FormData;
  return api.post(`/chats/${chatId}/send/`, data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
};

export const getUnreadCount = () => api.get('/chats/unread/');

// Избранное (ВОТ ТУТ ИСПРАВЛЕНЫ ПУТИ!)
export const getFavorites = () => api.get('/adverts/favorites/');
export const addFavorite = (advertId) => api.post('/adverts/favorites/', { advert_id: advertId });
export const removeFavorite = (favoriteId) => api.delete(`/adverts/favorites/${favoriteId}/`);
export const deleteMessage = (messageId) => api.delete(`/chats/messages/${messageId}/delete/`);