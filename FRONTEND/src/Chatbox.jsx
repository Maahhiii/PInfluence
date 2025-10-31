import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { Send, EmojiEmotions } from "@mui/icons-material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CustomModal from "./Modal"; // keep same filename as your project expects
import socket from "./socket";
import axios from "axios";

const Chatbox = ({ onClose }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const [modalPin, setModalPin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setCurrentUser(res.data);
        socket.emit("join", res.data._id);
        console.log("🟢 Joined room:", res.data._id);
      } catch (err) {
        console.error(
          "❌ Failed to fetch current user:",
          err.response?.data || err.message
        );
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;
    const loadFriends = async () => {
      try {
        const res = await api.get(`/users/friends/${currentUser._id}`);
        // ensure array
        setFriends(res.data || []);
        if (res.data && res.data.length > 0) setSelectedFriend(res.data[0]);
      } catch (err) {
        console.error(
          "❌ Error fetching friends:",
          err.response?.data || err.message
        );
      }
    };
    loadFriends();
  }, [currentUser]);

  useEffect(() => {
    console.log("Friends from chatbox:", friends);
  }, [friends]);

  // socket incoming message handler
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 Received (socket):", msg);
      const senderId = msg.senderId || msg.sender || msg.senderId;
      if (!senderId) return;
      setChats((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), msg],
      }));
      scrollToBottom();
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, []);

  useEffect(() => {
    if (!selectedFriend?._id) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${selectedFriend._id}`);
        setChats((prev) => ({ ...prev, [selectedFriend._id]: res.data || [] }));
      } catch (err) {
        console.error("❌ Error fetching chat history:", err);
      }
    };
    fetchHistory();
  }, [selectedFriend]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriend || !currentUser) return;
    const msgPayload = { receiverId: selectedFriend._id, text: message.trim() };
    try {
      const res = await api.post("/chat/send", msgPayload);
      const savedMsg = res.data;
      socket.emit("send_message", {
        receiverId: selectedFriend._id,
        message: savedMsg,
      });
      setChats((prev) => ({
        ...prev,
        [selectedFriend._id]: [...(prev[selectedFriend._id] || []), savedMsg],
      }));
    } catch (err) {
      console.error("Send message error:", err);
    }
    setMessage("");
    scrollToBottom();
  };

  // LISTEN FOR share-pin events (dispatched by Modal or Grid)
  useEffect(() => {
    const handlePinSend = async (e) => {
      const detail = e.detail || {};
      const friendId = detail.friendId;
      const pin = detail.pin; // ✅ Get the pin object here

      if (!friendId || !pin) {
        console.warn("send-pin event missing data:", detail);
        return;
      }

      if (!currentUser) {
        console.warn("No currentUser - cannot send pin");
        return;
      }

      console.log("📌 Pin received in Chatbox to send →", detail);

      try {
        const res = await api.post("/chat/send", {
          receiverId: friendId,
          text: "Shared a pin with you!",
          pin: pin, // ✅ pass the pin object correctly
        });

        const savedMsg = res.data;

        socket.emit("send_message", {
          receiverId: friendId,
          message: {
            ...savedMsg,
            senderId: currentUser._id, // ✅ ensures compatibility
          },
        });

        setChats((prev) => ({
          ...prev,
          [friendId]: [...(prev[friendId] || []), savedMsg],
        }));

        if (!selectedFriend || selectedFriend._id !== friendId) {
          const f = friends.find((x) => (x._id || x.id) === friendId);
          if (f) setSelectedFriend(f);
        }

        scrollToBottom();
        console.log("✅ Pin sent and local chat updated", savedMsg);
      } catch (err) {
        console.error(
          "📌 Error sending pin from handler:",
          err.response?.data || err.message || err
        );
      }
    };

    window.addEventListener("send-pin", handlePinSend);
    return () => window.removeEventListener("send-pin", handlePinSend);
  }, [friends, currentUser, selectedFriend]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!currentUser)
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          zIndex: 1400,
        }}
      >
        Loading chats...
      </Box>
    );

  return (
    <>
      {showModal && (
        <CustomModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          card={modalPin}
          currentUser={currentUser}
          friends={friends}
        />
      )}

      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            height: "92vh",
            width: "60vw",
            display: "flex",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.4)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: "230px",
              bgcolor: "#AFA8F0",
              display: "flex",
              flexDirection: "column",
              py: 3,
              px: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "#4B0082", mb: 2 }}>
              Chats
            </Typography>
            <Stack spacing={2}>
              {friends.map((friend) => {
                const fullName = `${friend.firstName || friend.name || ""} ${
                  friend.lastName || ""
                }`.trim();
                return (
                  <Box
                    key={friend._id || friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor:
                        selectedFriend?._id === (friend._id || friend.id)
                          ? "#C6E7FF"
                          : "transparent",
                      "&:hover": { bgcolor: "#D8F1FF" },
                    }}
                  >
                    <Avatar
                      src={friend.profilePic || undefined}
                      sx={{ bgcolor: "#FFF6E3", color: "#333" }}
                    />
                    <Typography fontWeight="bold">
                      {fullName || "Unknown"}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Chat Area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#FFF6E3",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "#AFA8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={selectedFriend?.profilePic || undefined}
                  sx={{ bgcolor: "#FFF6E3", color: "#333" }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {selectedFriend
                    ? `${selectedFriend.firstName || selectedFriend.name} ${
                        selectedFriend.lastName || ""
                      }`
                    : "Select a friend"}
                </Typography>
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>

            <Stack
              spacing={2}
              sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 2 }}
            >
              {(chats[selectedFriend?._id || selectedFriend?.id] || []).map(
                (msg, idx) => {
                  const realMsg = msg.message || msg; // socket vs history formats
                  const isMine =
                    realMsg.senderId === currentUser._id ||
                    realMsg.sender === currentUser._id;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                      }}
                    >
                      {realMsg.text && (
                        <Box
                          sx={{
                            bgcolor: isMine ? "#AFA8F0" : "#FFD5C2",
                            px: 2,
                            py: 1,
                            borderRadius: "15px",
                          }}
                        >
                          <Typography>{realMsg.text}</Typography>
                        </Box>
                      )}

                      {realMsg.pin && (
                        <Box
                          sx={{
                            mt: 1,
                            bgcolor: "#FC9CE3",
                            borderRadius: "16px",
                            overflow: "hidden",
                            p: 1,
                            maxWidth: "350px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setModalPin(realMsg.pin);
                            setShowModal(true);
                          }}
                        >
                          <img
                            src={realMsg.pin.image}
                            alt={realMsg.pin.title}
                            style={{ width: "100%", borderRadius: "12px" }}
                          />
                          <Typography mt={1} fontWeight="bold">
                            {realMsg.pin.title}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                }
              )}

              <div ref={messagesEndRef} />
            </Stack>

            <Box
              sx={{
                px: 2,
                pb: 2,
                pt: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
              }}
            >
              <IconButton>
                <EmojiEmotions sx={{ color: "#AFA8F0" }} />
              </IconButton>
              <TextField
                variant="standard"
                fullWidth
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                InputProps={{ disableUnderline: true, sx: { px: 2 } }}
              />
              <IconButton onClick={handleSendMessage}>
                <Send sx={{ color: "#AFA8F0" }} />
              </IconButton>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

export default Chatbox;
