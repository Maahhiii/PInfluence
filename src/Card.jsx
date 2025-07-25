// src/Card.jsx
import React from 'react';

function Card({ card, onClick }) {
  if (card.isFiller) {
    return (
      <div className="card invisible h-[200px] w-full"></div> // or skeleton shimmer
    );
  }

  return (
    <div 
      className="card cursor-pointer"
      onClick={() => onClick(card)}
    >
      <img src={card.image} alt={card.title} />
      <div className="overlay" />
    </div>
  );
}


export default Card;
