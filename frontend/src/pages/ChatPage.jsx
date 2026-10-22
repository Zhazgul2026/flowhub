import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChat, sendMessage, deleteMessage } from '../services/api';

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null); // Для просмотра фото
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadChat();
  }, [id, isLoggedIn, navigate]);

  // Скролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Автообновление чата
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn) loadChat();
    }, 5000);
    return () => clearInterval(interval);
  }, [id, isLoggedIn]);

  // Закрытие лайтбокса по Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const loadChat = () => {
    getChat(id)
      .then((res) => {
        setChat(res.data.chat);
        // Обновляем только если количество сообщений изменилось (чтобы не дергался экран)
        setMessages((prev) => {
            if (prev.length !== res.data.messages.length) return res.data.messages;
            return prev;
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) formData.append('image', image);

      const res = await sendMessage(id, formData);
      setMessages([...messages, res.data]);
      setText('');
      clearImage();
    } catch (err) {
      alert('Ошибка при отправке');
    } finally {
      setSending(false);
    }
  };

  // Удаление сообщения
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Удалить это сообщение?')) return;
    try {
      await deleteMessage(msgId);
      setMessages(messages.filter(m => m.id !== msgId));
    } catch (err) {
      alert('Ошибка при удалении');
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
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        
        {/* ШАПКА ЧАТА */}
        <div style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/chats" style={{ textDecoration: 'none', fontSize: '20px', color: '#1a1a2e' }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{chat.advert_title}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>👤 {interlocutor}</div>
          </div>
          <Link to={`/advert/${chat.advert}`} style={{ padding: '6px 12px', backgroundColor: '#e6f7ff', color: '#0066cc', textDecoration: 'none', borderRadius: '6px', fontSize: '13px' }}>К объявлению</Link>
        </div>

        {/* СООБЩЕНИЯ */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Начните диалог — отправьте первое сообщение.</p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_username === currentUser;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '75%', 
                    padding: '10px 15px', 
                    borderRadius: '12px', 
                    backgroundColor: isMine ? '#00F0FF' : '#fff', 
                    color: '#1a1a2e', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                    borderBottomRightRadius: isMine ? '4px' : '12px', 
                    borderBottomLeftRadius: isMine ? '12px' : '4px',
                    position: 'relative'
                  }}>
                    
                    {msg.text && <div style={{ fontSize: '15px', marginBottom: msg.image_url ? '8px' : 0, wordBreak: 'break-word' }}>{msg.text}</div>}
                    
                    {msg.image_url && (
                      <img 
                        src={msg.image_url} 
                        alt="Фото" 
                        style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', display: 'block', cursor: 'zoom-in' }} 
                        onClick={() => setLightboxImage(msg.image_url)}
                      />
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '10px' }}>
                      {isMine ? (
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          style={{ background: 'none', border: 'none', color: '#cc0000', fontSize: '11px', cursor: 'pointer', padding: 0, opacity: 0.7 }}
                          title="Удалить"
                        >
                          Удалить
                        </button>
                      ) : <span></span>}
                      
                      <div style={{ fontSize: '11px', color: isMine ? '#005f66' : '#999' }}>{formatTime(msg.created_at)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ФОРМА ОТПРАВКИ */}
        <form onSubmit={handleSend} style={{ padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
          {imagePreview && (
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '8px' }}>
              <img src={imagePreview} alt="Превью" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
              <span style={{ fontSize: '13px', flex: 1 }}>Фото прикреплено</span>
              <button type="button" onClick={clearImage} style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: '14px' }}>✕ Удалить</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '20px' }} title="Прикрепить фото">📎</button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
            
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите сообщение..."
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}
              autoFocus
            />
            <button type="submit" disabled={sending || (!text.trim() && !image)} style={{ padding: '10px 20px', backgroundColor: (!text.trim() && !image) ? '#ccc' : '#00F0FF', color: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: (!text.trim() && !image) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              {sending ? '...' : '➤'}
            </button>
          </div>
        </form>
      </div>

      {/* ЛАЙТБОКС ДЛЯ ФОТО */}
      {lightboxImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'zoom-out' }} 
          onClick={() => setLightboxImage(null)}
        >
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '30px', cursor: 'pointer' }}>✕</button>
          <img src={lightboxImage} alt="Просмотр" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export default ChatPage;