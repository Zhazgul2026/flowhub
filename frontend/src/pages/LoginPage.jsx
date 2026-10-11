import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('username', form.username);
      alert('Добро пожаловать!');
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">🔑 Вход</h1>
      <p className="form-subtitle">Войдите в свой аккаунт</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Имя пользователя</label>
        <input
          name="username"
          placeholder="Ваш логин"
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Пароль</label>
        <input
          name="password"
          type="password"
          placeholder="Ваш пароль"
          onChange={handleChange}
          required
          className="form-input"
        />

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="form-footer">
        Нет аккаунта? <Link to="/register" className="form-link">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;