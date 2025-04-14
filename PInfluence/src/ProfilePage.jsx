import React from 'react';
import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';  // Import the Add icon
import './ProfilePage.css';
const boards = [
  '/clothes_women/Img_database/c18.jpg',
  '/clothes_women/Img_database/c19.jpg',
  '/clothes_women/Img_database/p3.jpg',
  '/clothes_women/Img_database/c15.jpg',
  '/clothes_women/Img_database/c11.jpg',
  '/clothes_women/Img_database/c13.jpg',
  '/clothes_women/Img_database/c12.jpg',
];

const ProfilePage = () => {
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#FFF6E3' }}>
      {/* Banner Section */}
      <Box
        sx={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(to right, #AFA8F0, #FC9CE3)',
          position: 'relative',
        }}
      >
        {/* Avatar */}
        <Avatar
          src="/profile/avatar.png"
          sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            bottom: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            border: '4px solid white',
          }}
        />
      </Box>

      {/* Info & Actions */}
      <Box sx={{ mt: 8, textAlign: 'center', px: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: '#1E1E1E' }}>
          Ananya Sharma
        </Typography>
        <Typography sx={{ color: '#666' }}>@annie1016</Typography>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" startIcon={<EditIcon />} sx={{ bgcolor: '#FC9CE3', color: '#1E1E1E', borderRadius: '20px', px: 3 }}>
            Edit Profile
          </Button>
          <IconButton sx={{ bgcolor: '#AFA8F0', color: 'white' }}>
            <SettingsIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: '#AFA8F0', color: 'white' }}>
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* Stats */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 5 }}>
          <Box>
            <Typography variant="h6" color='#FC9CE3' fontWeight={500}>240</Typography>
            <Typography variant="body2" color="text.secondary">Followers</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color='#FC9CE3' fontWeight={500}>180</Typography>
            <Typography variant="body2" color="text.secondary">Following</Typography>
          </Box>
        </Box>
      </Box>

      {/* Boards Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Typography variant="h6" color='#FC9CE3' fontWeight={600} mb={2}>
          Your Boards
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {/* Render existing boards */}
          {boards.map((src, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(175, 168, 240, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            >
              <img
                src={src}
                alt={`board-${index}`}
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                }}
              />
            </Box>
          ))}

          {/* + New Board card, positioned as the 8th card */}
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(175, 168, 240, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                transform: 'scale(1.03)',
                },
                height: '260px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(to right, rgba(175, 168, 240, 0.5), rgba(252, 156, 227, 0.5))', // Gradient with opacity
            }}
            >
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                bgcolor: 'white',
                color: '#1E1E1E',
                borderRadius: '20px',
                px: 3,
                fontWeight: '600',
                }}
            >
                Add Board
            </Button>
            </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
