import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Navbar({ scrollToSignUp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#fdf6b6',
        boxShadow: 'none',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo (clickable) */}
        <Box
          component="img"
          src="/PInfluence LOGO.png"
          alt="Logo"
          onClick={handleLogoClick}
          sx={{
            width: { xs: '140px', sm: '160px', md: '190px' },
            height: { xs: '50px', sm: '60px', md: '70px' },
            transition: 'transform 0.3s ease-in-out',
            padding: '5px',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 1,
            marginTop: { xs: 1, sm: 0 },
          }}
        >
          <Button
            variant="contained"
            onClick={scrollToSignUp}
            sx={{
              backgroundColor: '#e692c3',
              color: '#FFF',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '16px',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: '#b47399',
                transform: 'scale(1.05)',
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="contained"
            onClick={handleLoginClick}
            sx={{
              backgroundColor: '#9698d3',
              color: '#FFF',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '16px',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: '#7375a2',
                transform: 'scale(1.05)',
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
