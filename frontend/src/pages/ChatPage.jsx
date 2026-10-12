import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChat, sendMessage } from '../services/api';

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadChat();
  }, [id, isLoggedIn, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn) loadChat();
    }, 5000);
    return () => clearInterval(interval);
  }, [id, isLoggedIn]);

  const loadChat = () => {
    getChat(id)
      .then((res) => {
        setChat(res.data.chat);
        setMessages(res.data.messages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await sendMessage(id, text);
      setMessages([...messages, res.data]);
      setText('');
    } catch (err) {
      alert('Ошибка при отправке');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;
  if (!chat) return <p style={{ padding: '20px' }}>Чат не найден</p>;

  const currentUser = localStorage.getItem('username');
  const interlocutor = chat.buyer_username === currentUser
    ? chat.seller_username
    : chat.buyer_username;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/chats" className="chat-back">← Назад</Link>
        <div className="chat-header-info">
          <div className="chat-title">{chat.advert_title}</div>
          <div className="chat-interlocutor">👤 {interlocutor}</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-empty">Начните диалог — отправьте первое сообщение.</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_username === currentUser;
            return (
              <div
                key={msg.id}
                className={`chat-message ${isMine ? 'mine' : 'theirs'}`}
              >
                <div className="chat-message-text">{msg.text}</div>
                <div className="chat-message-time">{formatTime(msg.created_at)}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          className="chat-input"
          autoFocus
        />
        <button type="submit" className="chat-send">➤</button>
      </form>
    </div>
  );
}

export default ChatPage;