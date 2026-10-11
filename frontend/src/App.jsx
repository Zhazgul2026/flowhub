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
import Header from './components/Header';
import InstallPWA from './components/InstallPWA';

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
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;