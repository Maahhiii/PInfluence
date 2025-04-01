// src/Grid.jsx
import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import Card from './Card';
import Modal from './Modal'; // Make sure this import is present
import './Grid.css';

function Grid({ cards }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breakpointColumnsObj = {
    default: 6,
    1100: 5,
    768: 3,
    480: 1
  };

  const handleCardClick = (card) => {
    console.log('Card clicked:', card);
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {cards.map((card, index) => (
          <Card key={index} card={card} onClick={handleCardClick} />
        ))}
      </Masonry>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        card={selectedCard} 
      />
    </>
  );
}

export default Grid;
