import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#FFFACD', // Soft yellow background
        boxShadow: 'none',
        padding: '0 16px',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo Section */}
        <Box
          component="img"
          src="/PInfluence LOGO.png" // Replace with your logo's path
          alt="Logo"
          sx={{
            width: '190px',       // Corrected: value in string
            height: '80px',      // Corrected: value in string
            marginRight: '10px', // Corrected: value in string
            transition: 'transform 0.3s ease-in-out',
          }}
        />

        {/* Buttons Section */}
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#007BFF', // Blue color for "Sign Up"
              color: '#FFF',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '16px',
              textTransform: 'capitalize',
              marginRight: 1,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#0056b3', // Darker blue on hover
                transform: 'scale(1.05)', // Slight scaling effect
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FF0055', // Red color for "Log In"
              color: '#FFF',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '16px',
              textTransform: 'capitalize',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#b3003b', // Darker red on hover
                transform: 'scale(1.05)', // Slight scaling effect
                transition: 'all 0.3s ease-in-out',
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
