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
import Iridescence from './Iridescence';

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
    </motion.div>
  );

  if (!isOpen || !card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalBackdropStyle, overflow: 'hidden' }}>
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: 'relative',
            zIndex: 1,
            background: 'transparent',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1000px',
            maxHeight: '95vh',
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* 🌈 Iridescence Background */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <Iridescence
              color={[255 / 255, 213 / 255, 194 / 255]}
              mouseReact={false}
              amplitude={0.1}
              speed={1.0}
            />
          </Box>

          {/* ❌ Close Button */}
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 🖼️ Image and Buttons */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <img
              src={card.image}
              alt="Pin"
              style={{
                maxHeight: '70vh',
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '16px',
                zIndex: 1,
              }}
            />

            <Stack
              direction="row"
              spacing={1.5}
              mt={3}
              justifyContent="center"
              flexWrap="wrap"
              rowGap={2}
            >
              {/* ❤️ Save Button */}
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
                      backgroundColor: pastelColors[1],
                      '&:hover': { backgroundColor: '#e68dcf' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Save Pin
                  </Button>
                </SparkleHover>
              </Tooltip>

              {/* ✉️ Send Button */}
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
                      backgroundColor: pastelColors[0],
                      '&:hover': { backgroundColor: '#9790e2' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Send
                  </Button>
                </SparkleHover>
              </Tooltip>

              {/* 🛍️ Shop Button */}
              <Tooltip
                title="Shop this look 🛍️"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: { bgcolor: pastelColors[2], color: 'black', fontWeight: 500 },
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
                      backgroundColor: pastelColors[2],
                      '&:hover': { backgroundColor: '#e6c0b0' },
                      borderRadius: '999px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Shop
                  </Button>
                </SparkleHover>
              </Tooltip>
            </Stack>

            {/* 👯 Friend List */}
            {showFriends && (
              <Box
                ref={friendIconsRef}
                mt={11}
                py={3}
                px={2}
                sx={{
                  background: 'linear-gradient(135deg, rgba(175,168,240,0.2), rgba(252,156,227,0.2), rgba(255,213,194,0.2))',
                  backdropFilter: 'blur(14px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '24px',
                  boxShadow: '0 6px 28px rgba(0, 0, 0, 0.2)',
                  maxWidth: '960px',
                  width: '100%',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    color: '#ffffff',
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 3,
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  Send to:
                </Typography>

                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="center"
                  flexWrap="wrap"
                  rowGap={2}
                >
                  {friends.map((friend, index) => (
                    <motion.div
                      whileHover={{
                        scale: 1.07,
                        transition: { type: 'spring', stiffness: 300 },
                      }}
                      key={index}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => sendToFriend(friend)}
                    >
                      <Avatar
                        src={friend.avatar}
                        alt={friend.name}
                        sx={{
                          width: { xs: 48, sm: 64 },
                          height: { xs: 48, sm: 64 },
                          mx: 'auto',
                          border: '2px solid white',
                          borderRadius: '999px',
                          boxShadow: `0 0 12px ${pastelColors[index % pastelColors.length]}`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        mt={1}
                        sx={{
                          color: pastelColors[index % pastelColors.length],
                          fontWeight: 500,
                          textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        }}
                      >
                        {friend.name}
                      </Typography>
                    </motion.div>
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
