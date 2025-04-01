// src/Modal.jsx
import React from 'react';
import './Modal.css'; // Create this file for modal styles

function Modal({ isOpen, onClose, card }) {
  if (!isOpen || !card) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-image-container">
          <img 
            src={card.image} 
            alt={card.title} 
            className="modal-image" 
          />
          
          <div className="modal-info">
            <h2 className="modal-title">{card.title}</h2>
            <p className="modal-brand">Brand: {card.brand || 'Fashion Brand'}</p>
            <a 
              href={card.shopLink || 'https://example.com/shop'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="shop-button"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
