import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton({ text = 'Назад', to = '/' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className="back-button">
      <span className="back-arrow">←</span>
      <span className="back-text">{text}</span>
    </button>
  );
}

export default BackButton;