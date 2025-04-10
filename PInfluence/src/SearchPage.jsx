import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Stack, Chip } from '@mui/material';
import Slider from 'react-slick';
import Grid from './Grid';
import clothesWomenData from './data/clothesWomen';
import clothesMenData from './data/clothesMen';
import './SearchPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SearchPage = ({ searchTerm: initialSearchTerm = '', isMale }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [showCarousel, setShowCarousel] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);

  const data = isMale ? clothesMenData : clothesWomenData;
  const popularPins = data.slice(0, 6);

  useEffect(() => {
    if (initialSearchTerm.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm]);

  const handleSearch = () => {
    const filtered = data.filter(card =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    setShowCarousel(false);

    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory(prev => [...prev.slice(-4), searchTerm]);
    }
  };

  const handleChipClick = (term) => {
    setSearchTerm(term);
    const filtered = data.filter(card =>
      card.title.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
    setShowCarousel(false);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#FFF6E3', color: '#1E1E1E', overflow: 'hidden' }}>
      {/* Custom Navbar for Search Page */}
      <Box sx={{ bgcolor: '#AFA8F0', px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>PInfluence</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, mx: 4 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ bgcolor: '#FC9CE3', color: 'black', px: 4, borderRadius: 2 }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Stack direction="row" spacing={1} my={2} px={4} flexWrap="wrap">
          <Typography variant="body1" sx={{ mr: 1 }}>Recent:</Typography>
          {searchHistory.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              clickable
              onClick={() => handleChipClick(term)}
              sx={{ bgcolor: '#F9EF9F', color: '#333' }}
            />
          ))}
        </Stack>
      )}

      {/* Carousel or Search Results */}
      {showCarousel ? (
        <Box sx={{ px: 4, pt: 2 }}>
          <Slider {...settings}>
            {popularPins.map((card, index) => (
              <Box key={index} px={1}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <Typography align="center" mt={1}>{card.title}</Typography>
              </Box>
            ))}
          </Slider>
        </Box>
      ) : (
        <Box px={4} pt={2}>
          <Grid cards={searchResults} />
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
