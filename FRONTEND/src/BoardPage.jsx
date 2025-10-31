import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Fab,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "./BoardModal"; // ✅ your existing modal

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🧩 Fetch board + pins
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/boards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(res.data);
        setPins(res.data.pins || []);
      } catch (err) {
        console.error("Error fetching board:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  /* ✅ Card click handling */
  const handleCardClick = (pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // 🗑 Remove pin
  const handleRemovePin = async (pinId) => {
    if (!window.confirm("Remove this pin from this board?")) return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/boards/${id}/pins`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { pinId }, // ✅ body data for DELETE
      });

      // update UI instantly
      setPins((prev) => prev.filter((p) => p._id !== pinId));
    } catch (err) {
      console.error("Error removing pin from board:", err);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!board)
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Board not found
      </Typography>
    );

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#FFF6E3",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* 🏷 Board Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <img
          src={`http://localhost:5000${board.coverImage}`}
          alt={board.name}
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "160px",
            borderRadius: "14px",
            objectFit: "cover",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        />
        <Typography
          variant="h5"
          fontWeight={700}
          color="#AFABF0"
          mt={2}
          textAlign="center"
        >
          {board.name}
        </Typography>
      </Box>

      {/* 🖼 Pins Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2.5,
          justifyItems: "center",
        }}
      >
        {pins.length > 0 ? (
          pins.map((pin) => (
            <Box
              key={pin._id}
              sx={{
                width: "100%",
                maxWidth: 230,
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                transition: "transform 0.25s ease",
                "&:hover": { transform: "scale(1.03)" },
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(pin)} 
            >
              <img
                src={
                  pin.image?.startsWith("http")
                    ? pin.image
                    : `http://localhost:5000${pin.image}`
                }
                alt={pin.title || "Pin"}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "14px",
                }}
              />

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePin(pin._id);
                }}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  bgcolor: "rgba(0,0,0,0.45)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  p: "4px",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "gray",
              mt: 4,
            }}
          >
            No pins yet — click the “+” button to add.
          </Typography>
        )}
      </Box>

      {/* ➕ Floating Add Pin Button */}
      <Fab
        color="primary"
        onClick={() => navigate("/grid")}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          bgcolor: "#AFABF0",
          "&:hover": { bgcolor: "#9b96f0" },
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      >
        <AddIcon sx={{ color: "white" }} />
      </Fab>

      <Modal isOpen={isModalOpen} onClose={closeModal} card={selectedPin} />
    </Box>
  );
};

export default BoardPage;
