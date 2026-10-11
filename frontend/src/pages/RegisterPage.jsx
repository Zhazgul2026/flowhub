import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      alert('Регистрация успешна! Теперь войдите.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n');
        setError(messages);
      } else {
        setError('Ошибка регистрации. Проверьте данные.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">✨ Регистрация</h1>
      <p className="form-subtitle">Создайте аккаунт во ЗипТапе</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Имя пользователя</label>
        <input
          name="username"
          placeholder="ivan_ivanov"
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@mail.ru"
          onChange={handleChange}
          className="form-input"
        />

        <label className="form-label">Телефон</label>
        <input
          name="phone"
          placeholder="+7 900 123-45-67"
          onChange={handleChange}
          className="form-input"
        />

        <label className="form-label">Пароль</label>
        <input
          name="password"
          type="password"
          placeholder="Минимум 8 символов"
          onChange={handleChange}
          required
          className="form-input"
        />

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="form-footer">
        Уже есть аккаунт? <Link to="/login" className="form-link">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;