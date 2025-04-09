// src/Card.jsx
import React from 'react';

function Card({ card, onClick }) {
  return (
    <div 
      className="card cursor-pointer"
      onClick={() => onClick(card)}
    >
      <img src={card.image} alt={card.title} />
      <div className="overlay">
      </div>
    </div>
  );
}

export default Card;
