import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, Button, Menu, MenuItem } from '@mui/material';
import Slider from 'react-slick';
import Grid from './Grid';
import './SearchPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TiltedCard from './TiltedCard';
import clothesWomen from './data/clothesWomen';
import clothesMen from './data/clothesMen';

const SearchPage = ({ searchTerm: initialSearchTerm = '', isMale }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [showCarousel, setShowCarousel] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const searchInputRef = useRef(null);

  const carouselData = [
    { image: '/SearchPageImg/image1.jpg', title: 'Fashion will find you' },
    { image: '/SearchPageImg/image2.jpg', title: 'Never too many options' },
    { image: '/SearchPageImg/image3.jpg', title: 'Build your closet' },
    { image: '/SearchPageImg/image4.jpg', title: 'Classy is the key' },
    { image: '/SearchPageImg/image5.jpg', title: 'Black screams power' },
    { image: '/SearchPageImg/image6.jpg', title: 'Colors should match' },
  ];

  useEffect(() => {
    if (initialSearchTerm.trim()) {
      handleSearch(initialSearchTerm);
    }

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchTerm]);

  const handleSearch = (term = searchTerm) => {
    const data = isMale ? clothesMen : clothesWomen;

    const filtered = data.filter(card =>
      card.title.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered);
    setShowCarousel(false);

    const cleanedTerm = term.trim();
    if (cleanedTerm && !searchHistory.includes(cleanedTerm.toLowerCase())) {
      setSearchHistory(prev => [
        ...prev.filter(t => t.toLowerCase() !== cleanedTerm.toLowerCase()).slice(-4),
        cleanedTerm
      ]);
    }
  };

  const handleChipClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
    setAnchorEl(null);
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
    autoplaySpeed: 2000,
    appendDots: dots => (
      <div style={{ marginTop: '20px' }}>
        <ul style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="custom-heart-dot">🩷</div>
    ),
    
  };

  
  

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#FFF6E3', color: '#1E1E1E', overflow: 'hidden', px: { xs: 1.5, md: 3 },}}>
      {/* Navbar */}
    <Box
      sx={{
        width: '100%',
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 4 },
        bgcolor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        position: 'relative',
      }}
    >
        <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Looking for something?"
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleDropdownClick}
          inputRef={searchInputRef}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 2,
              py: 1,
              borderRadius: '30px',
              bgcolor: 'white',
              fontSize: '16px',
              '&:focus-within': {
                boxShadow: '0 0 0 2px #CDC1FF',
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={() => handleSearch()}
          sx={{
            bgcolor: '#FC9CE3',
            color: 'black',
            px: { xs: 3, md: 4 },
            py: 1,
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: { xs: '12px', md: '14px' },
            boxShadow: '0px 4px 10px rgba(252, 156, 227, 0.4)',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#f693db',
            },
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
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: { xs: 2, md: 4 } }}>
    <Slider
      {...settings}
      style={{ width: '100%' }}
    >
      {carouselData.map((card, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%' }} 
          className="card"// Ensures that each item takes full width
        >
          <TiltedCard
            imageSrc={card.image}
            altText={card.title}
            captionText={card.title}
            imageHeight="550px"
            imageWidth="420px" // Keep this width consistent with the carousel
            rotateAmplitude={10}
            scaleOnHover={1.02}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '20px',
                  backdropFilter: 'blur(6px)',
                  zIndex: 10, // make sure it stays above the image
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.title}
              </div>
            }
          />
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
