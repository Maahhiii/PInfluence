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
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            console.log('Save Pin clicked');
          }}
        >
          Save Pin
        </button>
      </div>
    </div>
  );
}

export default Card;
