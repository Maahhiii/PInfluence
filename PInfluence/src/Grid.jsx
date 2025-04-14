// src/Grid.jsx
import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from './Card';
import Modal from './Modal';
import './Grid.css';
import { Box, Typography, Fade } from '@mui/material';

function Grid({ cards, filter }) {
  const [allCards, setAllCards] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const filtered = filter ? cards.filter(card => card.category === filter) : cards;
    setAllCards(shuffleCards(filtered));
    setVisibleCount(40);
  }, [filter, cards]);

  const shuffleCards = (arr) => arr.slice().sort(() => 0.5 - Math.random());

  const loadMore = () => {
    setTimeout(() => {
      const moreCards = shuffleCards(
        cards.filter(card => !filter || card.category === filter)
      ).slice(0, 15);
      setAllCards(prev => [...prev, ...moreCards]);
      setVisibleCount(prev => prev + moreCards.length);
    }, 800);
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 5,
    768: 3,
    480: 1,
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="grid-wrapper">
      <InfiniteScroll
        dataLength={visibleCount}
        next={loadMore}
        hasMore={true}
        loader={
          <Typography
            align="center"
            sx={{ py: 4, color: '#FF69B4', fontWeight: 500 }}
          >
            ✨ Fetching more fashion inspo...
          </Typography>
        }
        scrollThreshold={0.8}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {allCards.slice(0, visibleCount).map((card, index) => (
            <Fade in={true} timeout={600} key={`${index}-${card.image}`}>
              <Box>
                <Card card={card} onClick={handleCardClick} />
              </Box>
            </Fade>
          ))}
        </Masonry>
      </InfiniteScroll>

      <Modal isOpen={isModalOpen} onClose={closeModal} card={selectedCard} />
    </div>
  );
}

export default Grid;
  