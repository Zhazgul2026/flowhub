import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatsPage from './pages/ChatsPage';
import ChatPage from './pages/ChatPage';
import AdvertDetail from './components/AdvertDetail';
import CreateAdvert from './components/CreateAdvert';
import Profile from './components/Profile';
import VerifyPage from './pages/VerifyPage';
import PricingPage from './pages/PricingPage';
import Header from './components/Header';
import InstallPWA from './components/InstallPWA';
import FavoritesPage from './pages/FavoritesPage'; // <-- Импорт в правильном месте

// Если эти два файла у тебя лежат в components, а не в pages, 
// то исправь путь на './components/EditAdvertPage' и './components/MyAdvertsPage'
import EditAdvertPage from './components/EditAdvertPage'; 
import MyAdvertsPage from './components/MyAdvertsPage'; 

function App() {
  return (
    <BrowserRouter>
      <Header />
      <InstallPWA />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/advert/:id" element={<AdvertDetail />} />
        <Route path="/create" element={<CreateAdvert />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/edit/:id" element={<EditAdvertPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/my-adverts" element={<MyAdvertsPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;