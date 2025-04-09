import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  Avatar,
  Stack,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StarIcon from '@mui/icons-material/Star';

const pastelColors = ['#AFA8F0', '#FC9CE3', '#FFD5C2', '#F9EF9F', '#C6E7FF'];

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 1300,
};

function CustomModal({ isOpen, onClose, card }) {
  const [showFriends, setShowFriends] = useState(false);
  const friendIconsRef = useRef(null);

  const friends = [
    { name: 'Aanya', avatar: '/profiles/aanya.jpg' },
    { name: 'Meera', avatar: '/profiles/meera.jpg' },
    { name: 'Tanya', avatar: '/profiles/tanya.jpg' },
  ];

  const sendToFriend = (friend) => {
    console.log(`Message sent to ${friend.name}`);
    setShowFriends(true);
    setTimeout(() => {
      friendIconsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const SparkleHover = ({ children }) => (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { type: 'spring', stiffness: 300 },
      }}
      style={{ position: 'relative' }}
    >
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: -10,
          right: -10,
          display: 'flex',
          gap: 4,
        }}
      >
        {pastelColors.map((color, i) => (
          <StarIcon key={i} sx={{ fontSize: 14, color }} />
        ))}
      </motion.div>
    </motion.div>
  );

  if (!isOpen || !card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalBackdropStyle}>
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            background: 'linear-gradient(135deg, #FC9CE3, #FFD5C2)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'auto',
            p: 3,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box
              component="img"
              src={card.image}
              alt="Pin"
              sx={{
                maxHeight: '70vh',
                width: '100%',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />

            <Stack direction="row" spacing={2} mt={3} justifyContent="center" flexWrap="wrap">
              <Tooltip
                title="Add to your board 💖"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: { bgcolor: pastelColors[1], color: 'black', fontWeight: 500 },
                  },
                }}
              >
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      backgroundColor: '#FC9CE3',
                      '&:hover': { backgroundColor: '#e68dcf' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                    }}
                  >
                    Save Pin
                  </Button>
                </SparkleHover>
              </Tooltip>

              <Tooltip
                title="Send this pin to a friend 💌"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: { bgcolor: pastelColors[0], color: 'black', fontWeight: 500 },
                  },
                }}
              >
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => sendToFriend(friends[0])}
                    sx={{
                      backgroundColor: '#AFA8F0',
                      '&:hover': { backgroundColor: '#9790e2' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                    }}
                  >
                    Send
                  </Button>
                </SparkleHover>
              </Tooltip>

              <Tooltip
                title="Shop this look 🛍️"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: { bgcolor: pastelColors[4], color: 'black', fontWeight: 500 },
                  },
                }}
              >
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingBagIcon />}
                    component="a"
                    href={card.shopLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#FFD5C2',
                      '&:hover': { backgroundColor: '#e6c0b0' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                    }}
                  >
                    Shop
                  </Button>
                </SparkleHover>
              </Tooltip>
            </Stack>

            {showFriends && (
              <Box ref={friendIconsRef} mt={4} textAlign="center">
                <Typography variant="h6" color="white" gutterBottom>
                  Send to:
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center">
                  {friends.map((friend, index) => (
                    <Box
                      key={index}
                      onClick={() => sendToFriend(friend)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Avatar
                        src={friend.avatar}
                        alt={friend.name}
                        sx={{
                          width: 56,
                          height: 56,
                          margin: '0 auto',
                          border: '2px solid white',
                          borderRadius: '999px',
                        }}
                      />
                      <Typography variant="body2" color="white">
                        {friend.name}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
