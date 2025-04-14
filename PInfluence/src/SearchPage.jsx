import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Menu, MenuItem } from '@mui/material';
import Slider from 'react-slick';
import Grid from './Grid';
import './SearchPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SearchPage = ({ searchTerm: initialSearchTerm = '', isMale }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [showCarousel, setShowCarousel] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const carouselData = [
    { image: '/SearchPageImg/image1.jpg', title: 'img1' },
    { image: '/SearchPageImg/image2.jpg', title: 'img2' },
    { image: '/SearchPageImg/image3.jpg', title: 'img3' },
    { image: '/SearchPageImg/image1.jpg', title: 'img4' },
    { image: '/SearchPageImg/image2.jpg', title: 'img5' },
    { image: '/SearchPageImg/image3.jpg', title: 'img6' },
  ];

  useEffect(() => {
    if (initialSearchTerm.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm]);

  const handleSearch = () => {
    const data = isMale ? [] : [];
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
    handleSearch();
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1200,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#FFF6E3', color: '#1E1E1E', overflowX: 'hidden' }}>
      {/* Navbar */}
      <Box sx={{ bgcolor: '#AFA8F0', px: { xs: 2, md: 4 }, py: { xs: 1.5, md: 1 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: 'white', fontSize: { xs: '16px', md: '20px' } }}>
          PInfluence
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexGrow: 1, mx: { xs: 2, md: 4 } }}>
          <TextField
            fullWidth
            placeholder="Search..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleDropdownClick}
            sx={{ bgcolor: 'white', borderRadius: '8px' }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: '#FC9CE3',
              color: 'black',
              px: { xs: 2, md: 4 },
              borderRadius: '8px',
              fontSize: { xs: '12px', md: '14px' },
            }}
          >
            Search
          </Button>

          {/* Search History Dropdown */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
            {searchHistory.length > 0 ? (
              searchHistory.map((term, idx) => (
                <MenuItem key={idx} onClick={() => handleChipClick(term)}>
                  {term}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No recent searches</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      {/* Carousel or Search Results */}
      {showCarousel ? (
        <Box sx={{ px: { xs: 2, md: 4 }, pt: 4 }}>
          <Slider {...settings}>
            {carouselData.map((card, index) => (
              <Box
                key={index}
                px={1}
                position="relative"
                sx={{
                  overflow: 'hidden',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  '&:hover .hover-text': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '600px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                />
                <Box
                  className="hover-text"
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '30px',
                    transform: 'translateY(20px)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                >
                  {card.title}
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      ) : (
        <Box px={{ xs: 2, md: 4 }} pt={4}>
          <Grid cards={searchResults} />
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
  