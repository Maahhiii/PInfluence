import React from "react";
import {
  Modal as MUIModal,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { motion } from "framer-motion";
import Iridescence from "./Iridescence";
import "./Modal.css"

const pastelColors = ["#AFA8F0", "#FC9CE3", "#FFD5C2"];

const Modal = ({ isOpen, onClose, card }) => {
  if (!card) return null;

  const imageSrc = card.image?.startsWith("http")
    ? card.image
    : `http://localhost:5000${card.image}`;

  return (
    <MUIModal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "800px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #FC9CE3, #FFD5C2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Iridescent Layer */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Iridescence
              color={[175 / 255, 168 / 255, 240 / 255]}
              mouseReact={false}
              amplitude={0.12}
              speed={1.0}
            />
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Image */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <img
              src={imageSrc}
              alt={card.title || "Pin"}
              className="modal-image"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "16px",
                border: "4px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />

            {/* Buttons below image */}
            <Stack
              direction="row"
              spacing={1.5}
              mt={3}
              justifyContent="center"
              flexWrap="wrap"
              rowGap={2}
            >
              {/* Save Pin */}
              <Tooltip title="Add to your board 💖" arrow placement="top">
                <Button
                  variant="contained"
                  startIcon={<FavoriteIcon />}
                  sx={{
                    backgroundColor: pastelColors[1],
                    "&:hover": { backgroundColor: "#e68dcf" },
                    borderRadius: "999px",
                    fontWeight: "bold",
                    color: "white",
                    px: 3,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Save Pin
                </Button>
              </Tooltip>

              {/* Shop Button */}
              {card.shopLink && (
                <Tooltip title="Shop this look 🛍️" arrow placement="top">
                  <Button
                    variant="contained"
                    startIcon={<ShoppingBagIcon />}
                    href={card.shopLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: pastelColors[2],
                      "&:hover": { backgroundColor: "#e6c0b0" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      color: "white",
                      px: 3,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    Shop
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </MUIModal>
  );
};

export default Modal;
