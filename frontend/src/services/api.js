import axios from 'axios';

const API_URL = 'https://ziptap-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const register = (data) => api.post('/auth/register/', data);
export const login = (data) => api.post('/auth/login/', data);
export const getProfile = () => api.get('/auth/me/');

export const getAdverts = (params) => api.get('/adverts/', { params });
export const createAdvert = (data) => {
  const isFormData = data instanceof FormData;
  return api.post('/adverts/', data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
};
export const getAdvert = (id) => api.get(`/adverts/${id}/`);
export const boostAdvert = (id) => api.post(`/adverts/${id}/boost/`);
export const getCategories = () => api.get('/adverts/categories/');

export const getWholesaleOrders = () => api.get('/wholesale/orders/');
export const createWholesaleRequest = (data) => api.post('/wholesale/requests/', data);
export const depositEscrow = (orderId) => api.post(`/wholesale/escrow/deposit/${orderId}/`);
export const confirmEscrow = (orderId) => api.post(`/wholesale/escrow/confirm/${orderId}/`);
export const disputeOrder = (orderId) => api.post(`/wholesale/escrow/dispute/${orderId}/`);

export const checkText = (text) => api.post('/moderation/check-text/', { text });
// Чат
export const getChats = () => api.get('/chats/');
export const getChat = (id) => api.get(`/chats/${id}/`);
export const createChat = (advertId) => api.post('/chats/', { advert: advertId });
export const sendMessage = (chatId, text) => api.post(`/chats/${chatId}/send/`, { text });
export const getUnreadCount = () => api.get('/chats/unread/');