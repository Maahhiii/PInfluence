import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  Avatar,
  Stack,
  Tooltip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Iridescence from "./Iridescence";

const pastelColors = ["#AFA8F0", "#FC9CE3", "#FFD5C2", "#F9EF9F", "#C6E7FF"];

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  zIndex: 1300,
};

function CustomModal({ isOpen, onClose, card }) {
  const [showFriends, setShowFriends] = useState(false);
  const friendIconsRef = useRef(null);

  // Boards/save-pin UI state
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
  const [boards, setBoards] = useState(null); // null = loading, [] = none
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: "", description: "", cover: null });
  const [savingToBoardId, setSavingToBoardId] = useState(null);

  const friends = [
    { name: "Aanya", avatar: "/profiles/aanya.jpg" },
    { name: "Meera", avatar: "/profiles/meera.jpg" },
    { name: "Tanya", avatar: "/profiles/tanya.jpg" },
  ];

  useEffect(() => {
    if (isSavePanelOpen) fetchBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavePanelOpen]);

  const fetchBoards = async () => {
    try {
      setLoadingBoards(true);
      const token = localStorage.getItem("token");
      if (!token) return setBoards([]); // not logged in -> no boards
      const res = await axios.get("http://localhost:5000/api/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data || []);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setBoards([]);
    } finally {
      setLoadingBoards(false);
    }
  };

  const createBoardAPI = async () => {
    if (!newBoard.name) return alert("Please enter a board name");
    try {
      setCreatingBoard(true);
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("name", newBoard.name);
      fd.append("description", newBoard.description || "");
      if (newBoard.cover) fd.append("cover", newBoard.cover);

      const res = await axios.post("http://localhost:5000/api/boards/create", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // append to boards list and switch UI to show boards
      setBoards((prev) => (prev ? [res.data, ...prev] : [res.data]));
      setNewBoard({ name: "", description: "", cover: null });
      setCreatingBoard(false);
      alert("Board created");
    } catch (err) {
      console.error("createBoard error:", err);
      setCreatingBoard(false);
      alert("Failed to create board");
    }
  };

  const addPinToBoardAPI = async (boardId) => {
    try {
      setSavingToBoardId(boardId);
      const token = localStorage.getItem("token");
      // card should have _id (pin id) — using card._id or card.id
      const pinId = card._id || card.id;
      if (!pinId) return alert("Pin id not found");

      const res = await axios.post(
        `http://localhost:5000/api/boards/${boardId}/add-pin`,
        { pinId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // success - you may notify UI or close
      setSavingToBoardId(null);
      setIsSavePanelOpen(false);
      alert("Pin saved to board!");
    } catch (err) {
      console.error("addPinToBoard error:", err);
      setSavingToBoardId(null);
      alert("Failed to save pin to board");
    }
  };

  const sendToFriend = (friend) => {
    console.log(`Message sent to ${friend.name}`);
    setShowFriends(true);
    setTimeout(() => {
      friendIconsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const SparkleHover = ({ children }) => (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 },
      }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );

  if (!isOpen || !card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalBackdropStyle, overflow: "hidden" }}>
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
            borderRadius: "16px",
            width: "95%",
            maxWidth: "1000px",
            maxHeight: "95vh",
            overflow: "auto",
            p: { xs: 2, sm: 3 },
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Iridescence */}
          <Box sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <Iridescence color={[255 / 255, 213 / 255, 194 / 255]} mouseReact={false} amplitude={0.1} speed={1.0} />
          </Box>

          {/* Close */}
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Image & buttons */}
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <img
              src={card.image}
              alt="Pin"
              style={{
                maxHeight: "70vh",
                width: "100%",
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "16px",
                zIndex: 1,
              }}
            />

            <Stack direction="row" spacing={1.5} mt={3} justifyContent="center" flexWrap="wrap" rowGap={2}>
              {/* Save Pin */}
              <Tooltip
                title="Add to your board 💖"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: { sx: { bgcolor: pastelColors[1], color: "black", fontWeight: 500 } },
                }}
              >
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      backgroundColor: pastelColors[1],
                      "&:hover": { backgroundColor: "#e68dcf" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={() => setIsSavePanelOpen((s) => !s)}
                  >
                    Save Pin
                  </Button>
                </SparkleHover>
              </Tooltip>

              {/* Send */}
              <Tooltip title="Send this pin to a friend 💌" arrow placement="top" componentsProps={{ tooltip: { sx: { bgcolor: pastelColors[0], color: "black", fontWeight: 500 } } }}>
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => sendToFriend(friends[0])}
                    sx={{
                      backgroundColor: pastelColors[0],
                      "&:hover": { backgroundColor: "#9790e2" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Send
                  </Button>
                </SparkleHover>
              </Tooltip>

              {/* Shop */}
              <Tooltip title="Shop this look 🛍️" arrow placement="top" componentsProps={{ tooltip: { sx: { bgcolor: pastelColors[2], color: "black", fontWeight: 500 } } }}>
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
                      "&:hover": { backgroundColor: "#e6c0b0" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Shop
                  </Button>
                </SparkleHover>
              </Tooltip>
            </Stack>

            {/* Save Panel (shows when Save Pin clicked) */}
            {isSavePanelOpen && (
              <Box
                sx={{
                  mt: 3,
                  width: "100%",
                  maxWidth: 900,
                  zIndex: 2,
                  background: "linear-gradient(135deg, rgba(175,168,240,0.12), rgba(252,156,227,0.12))",
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1, color: "#fff", fontWeight: 600 }}>
                  Save this Pin to:
                </Typography>

                {/* Loading state */}
                {loadingBoards ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : (
                  <>
                    {/* If user has boards */}
                    {boards && boards.length > 0 ? (
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        {boards.map((b) => (
                          <Box
                            key={b._id}
                            sx={{
                              minWidth: 160,
                              borderRadius: 2,
                              p: 1,
                              background: "rgba(255,255,255,0.06)",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={b.coverImage ? `http://localhost:5000${b.coverImage}` : (card.image || "/placeholder.png")}
                              alt={b.name}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 8,
                                marginBottom: 8,
                              }}
                            />
                            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>{b.name}</Typography>

                            <Button
                              size="small"
                              variant="contained"
                              sx={{ borderRadius: "20px", textTransform: "none" }}
                              onClick={() => addPinToBoardAPI(b._id)}
                              disabled={savingToBoardId === b._id}
                            >
                              {savingToBoardId === b._id ? "Saving..." : "Save here"}
                            </Button>
                          </Box>
                        ))}
                        {/* Add board shortcut */}
                        <Box
                          sx={{
                            minWidth: 160,
                            borderRadius: 2,
                            p: 2,
                            background: "rgba(255,255,255,0.03)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            startIcon={<AddIcon />}
                            variant="outlined"
                            onClick={() => setCreatingBoard((s) => !s)}
                            sx={{ borderRadius: "999px", color: "#fff" }}
                          >
                            Create Board
                          </Button>
                        </Box>
                      </Stack>
                    ) : (
                      // No boards -> prompt to create
                      <Box sx={{ py: 2 }}>
                        <Typography sx={{ color: "#fff", mb: 1 }}>You don't have any boards yet.</Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreatingBoard(true)} sx={{ borderRadius: "999px" }}>
                          Create your first board
                        </Button>
                      </Box>
                    )}
                  </>
                )}

                {/* Create board inline */}
                {creatingBoard && (
                  <Box sx={{ mt: 2, display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                    <TextField
                      placeholder="Board name"
                      value={newBoard.name}
                      onChange={(e) => setNewBoard((p) => ({ ...p, name: e.target.value }))}
                      sx={{ background: "white", borderRadius: 1, flex: 1 }}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Upload Cover
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => setNewBoard((p) => ({ ...p, cover: e.target.files[0] }))}
                      />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={createBoardAPI}
                      disabled={!newBoard.name}
                      sx={{ borderRadius: "999px" }}
                    >
                      Create
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Friend list */}
            {showFriends && (
              <Box
                ref={friendIconsRef}
                mt={11}
                py={3}
                px={2}
                sx={{
                  background: "linear-gradient(135deg, rgba(175,168,240,0.2), rgba(252,156,227,0.2), rgba(255,213,194,0.2))",
                  backdropFilter: "blur(14px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "24px",
                  boxShadow: "0 6px 28px rgba(0, 0, 0, 0.2)",
                  maxWidth: "960px",
                  width: "100%",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    color: "#ffffff",
                    fontWeight: 600,
                    textAlign: "center",
                    mb: 3,
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  Send to:
                </Typography>

                <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" rowGap={2}>
                  {friends.map((friend, index) => (
                    <motion.div
                      whileHover={{
                        scale: 1.07,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                      key={index}
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => sendToFriend(friend)}
                    >
                      <Avatar
                        src={friend.avatar}
                        alt={friend.name}
                        sx={{
                          width: { xs: 48, sm: 64 },
                          height: { xs: 48, sm: 64 },
                          mx: "auto",
                          border: "2px solid white",
                          borderRadius: "999px",
                          boxShadow: `0 0 12px ${pastelColors[index % pastelColors.length]}`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        mt={1}
                        sx={{
                          color: pastelColors[index % pastelColors.length],
                          fontWeight: 500,
                          textShadow: "0 1px 1px rgba(0,0,0,0.1)",
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
