import React, { useState, useEffect } from "react";
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
import Iridescence from "./Iridescence";
import axios from "axios";

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

function CustomModal({
  isOpen,
  onClose,
  card = {},
  currentUser,
  friends = [],
}) {
  const [showFriends, setShowFriends] = useState(false);

  // Boards/save-pin UI state (unchanged behavior)
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
  const [boards, setBoards] = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    cover: null,
  });
  const [savingToBoardId, setSavingToBoardId] = useState(null);

  // ---- IMPORTANT: Modal no longer calls backend for sending pin.
  // It dispatches an event `{ friend, pin }` which Chatbox listens to
  // and does the API + socket work. This prevents double sends.

  const sendToFriend = (friend) => {
    if (!currentUser || !friend) return;

    const pinPayload = {
      image: card.image,
      title: card.title || "Shared Pin",
      link: card.shopLink || "#",
      _id: card._id,
    };

    // Dispatch event that chatbox listens to
    window.dispatchEvent(
      new CustomEvent("send-pin", {
        detail: { friendId: friend._id, friend, pin: pinPayload },
      })
    );

    setShowFriends(false);
    // friendly UX
    alert(`📌 Pin sent to ${friend.firstName || friend.name || "friend"}`);
  };

  const handleSaveToBoard = async (boardId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/boards/${boardId}/add-pin`,
        { pinId: card._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Pin saved!");
      setIsSavePanelOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save pin.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/boards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(data);
      } catch (err) {
        console.error("Failed to load boards", err);
      }
    };
    fetchBoards();
  }, [isOpen]);

  const SparkleHover = React.forwardRef(({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 },
      }}
      style={{ position: "relative" }}
      {...props}
    >
      {children}
    </motion.div>
  ));

  const handleCreateBoardFromModal = async () => {
    if (!newBoard.name || !newBoard.cover)
      return alert("Please enter a name and upload a cover image");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newBoard.name);
      formData.append("description", newBoard.description || "");
      formData.append("cover", newBoard.cover);

      const res = await axios.post(
        "http://localhost:5000/api/boards/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Add new board to UI
      setBoards((prev) => [...(prev || []), res.data]);
      setNewBoard({ name: "", description: "", cover: null });
      setCreatingBoard(false);
      alert("Board created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating board.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalBackdropStyle, overflow: "hidden" }}>
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
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
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Iridescence
              color={[255 / 255, 213 / 255, 194 / 255]}
              mouseReact={false}
              amplitude={0.08}
              speed={1}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <img
              src={card.image || "/placeholder.png"}
              alt={card.title || "Pin"}
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

            <Stack
              direction="row"
              spacing={1.5}
              mt={3}
              justifyContent="center"
              flexWrap="wrap"
              rowGap={2}
            >
              <Tooltip title="Add to your board" arrow>
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      backgroundColor: pastelColors[1],
                      "&:hover": { backgroundColor: "#e68dcf" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    }}
                    onClick={() => setIsSavePanelOpen((s) => !s)}
                  >
                    Save Pin
                  </Button>
                </SparkleHover>
              </Tooltip>

              <Tooltip title="Send this pin to a friend" arrow>
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => setShowFriends((s) => !s)}
                    sx={{
                      backgroundColor: pastelColors[0],
                      "&:hover": { backgroundColor: "#9790e2" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    }}
                  >
                    Send
                  </Button>
                </SparkleHover>
              </Tooltip>

              <Tooltip title="Shop this look" arrow>
                <SparkleHover>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingBagIcon />}
                    component="a"
                    href={card.shopLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      backgroundColor: pastelColors[2],
                      "&:hover": { backgroundColor: "#e6c0b0" },
                      borderRadius: "999px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    }}
                  >
                    Shop
                  </Button>
                </SparkleHover>
              </Tooltip>
            </Stack>

            {/* Save panel (unchanged) */}
            {isSavePanelOpen && (
              <Box
                sx={{
                  mt: 3,
                  width: "100%",
                  maxWidth: 900,
                  zIndex: 2,
                  background:
                    "linear-gradient(135deg, rgba(175,168,240,0.12), rgba(252,156,227,0.12))",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, color: "#fff", fontWeight: 600 }}
                >
                  Save this Pin to:
                </Typography>

                {loadingBoards ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 2 }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                ) : boards && boards.length > 0 ? (
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {boards.map((b) => (
                      <Box
                        key={b._id}
                        sx={{
                          minWidth: 160,
                          borderRadius: 2,
                          p: 1,
                          background: "rgba(255,255,255,0.06)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={
                            b.coverImage
                              ? `http://localhost:5000${b.coverImage}`
                              : card.image || "/placeholder.png"
                          }
                          alt={b.name}
                          style={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 8,
                          }}
                        />
                        <Typography
                          sx={{ color: "#fff", fontWeight: 600, mb: 1 }}
                        >
                          {b.name}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ borderRadius: "20px", textTransform: "none" }}
                          onClick={() => handleSaveToBoard(b._id)} // <-- You should wire real save
                        >
                          Save here
                        </Button>
                      </Box>
                    ))}

                    {/* ➕ Always show Add Board card */}
                    <Box
                      onClick={() => setCreatingBoard(true)}
                      sx={{
                        minWidth: 160,
                        height: 150,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.1)",
                        border: "2px dashed rgba(255,255,255,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <AddIcon sx={{ fontSize: 30, color: "#fff" }} />
                      <Typography sx={{ color: "#fff", mt: 1 }}>
                        Create Board
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ py: 2 }}>
                    <Typography sx={{ color: "#fff", mb: 1 }}>
                      You don't have any boards yet.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setCreatingBoard(true)}
                      sx={{ borderRadius: "999px" }}
                    >
                      Create your first board
                    </Button>
                  </Box>
                )}

                {creatingBoard && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      placeholder="Board name"
                      value={newBoard.name}
                      onChange={(e) =>
                        setNewBoard((p) => ({ ...p, name: e.target.value }))
                      }
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
                        onChange={(e) =>
                          setNewBoard((p) => ({
                            ...p,
                            cover: e.target.files[0],
                          }))
                        }
                      />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCreateBoardFromModal}
                      disabled={!newBoard.name}
                      sx={{ borderRadius: "999px" }}
                    >
                      Create
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {showFriends && (
              <Box
                mt={5}
                py={3}
                px={3}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(175,168,240,0.25), rgba(252,156,227,0.25))",
                  borderRadius: "20px",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "#fff", fontWeight: 600 }}
                >
                  Send this pin to:
                </Typography>

                {friends === undefined ? (
                  <Typography sx={{ color: "#fff", textAlign: "center" }}>
                    Loading friends...
                  </Typography>
                ) : friends.length === 0 ? (
                  <Typography sx={{ color: "#fff", textAlign: "center" }}>
                    No friends found 😢
                  </Typography>
                ) : (
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    {friends.map((friend) => (
                      <Box
                        key={friend._id || friend.id}
                        onClick={() => sendToFriend(friend)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.15)",
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Avatar
                          src={friend.profilePic || undefined}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "#fff6e3",
                            color: "#333",
                          }}
                        >
                          {friend.firstName?.[0] || friend.name?.[0] || "?"}
                        </Avatar>
                        <Typography
                          mt={1}
                          sx={{ color: "#fff", fontWeight: 500 }}
                        >
                          {friend.firstName || friend.name}{" "}
                          {friend.lastName || ""}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
