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
import CustomModal from "./Modal";
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

  // ✅ Helper: Axios instance with auth header
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ Fetch logged-in user
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

  // ✅ Load user’s friends once we have currentUser
  useEffect(() => {
    if (!currentUser?._id) return;
    const loadFriends = async () => {
      try {
        const res = await api.get(`/users/friends/${currentUser._id}`);
        setFriends(res.data);
        if (res.data.length > 0) setSelectedFriend(res.data[0]);
      } catch (err) {
        console.error(
          "❌ Error fetching friends:",
          err.response?.data || err.message
        );
      }
    };
    loadFriends();
  }, [currentUser]);

  // ✅ Receive messages from socket
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 Received:", msg);
      const senderId = msg.senderId;
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
        setChats((prev) => ({
          ...prev,
          [selectedFriend._id]: res.data,
        }));
      } catch (err) {
        console.error("❌ Error fetching chat history:", err);
      }
    };
    fetchHistory();
  }, [selectedFriend]);

  // ✅ Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriend || !currentUser) return;

    const msgPayload = {
      receiverId: selectedFriend._id,
      text: message.trim(),
    };

    try {
      // Save to backend
      const res = await api.post("/chat/send", msgPayload);
      const savedMsg = res.data;

      // Emit via socket
      socket.emit("send_message", {
        receiverId: selectedFriend._id,
        message: savedMsg,
      });

      // Update local UI
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

  // Handle shared pin messages fully real-time
  useEffect(() => {
    const handlePinSend = async (e) => {
      const { friend, pin } = e.detail;
      if (!currentUser || !friend) return;

      try {
        // 1️⃣ Save pin message via API
        const res = await api.post("/chat/send", {
          receiverId: friend._id,
          text: "Shared a pin with you!",
          pin,
        });
        const savedMsg = res.data;

        // 2️⃣ Emit via socket
        socket.emit("send_message", {
          receiverId: friend._id,
          message: savedMsg,
        });

        // 3️⃣ Update local chat UI for sender
        setChats((prev) => ({
          ...prev,
          [friend._id]: [...(prev[friend._id] || []), savedMsg],
        }));

        scrollToBottom();
      } catch (err) {
        console.error("📌 Error sending pin:", err);
      }
    };

    window.addEventListener("send-pin", handlePinSend);
    return () => window.removeEventListener("send-pin", handlePinSend);
  }, [friends, currentUser]);

  // ✅ Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!currentUser)
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "18px",
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
          friends={friends} // ⚡ pass friends with _id
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
            backgroundColor: "rgba(255, 255, 255, 0.4)",
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
                const fullName =
                  friend.firstName +
                  " " +
                  (friend.lastName ? friend.lastName : "");
                return (
                  <Box
                    key={friend._id}
                    onClick={() => setSelectedFriend(friend)}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor:
                        selectedFriend?._id === friend._id
                          ? "#C6E7FF"
                          : "transparent",
                      "&:hover": { bgcolor: "#D8F1FF" },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#FFF6E3", color: "#333" }} />
                    <Typography fontWeight="bold">{fullName}</Typography>
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
            {/* Header */}
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
                <Avatar sx={{ bgcolor: "#FFF6E3", color: "#333" }} />
                <Typography variant="h6" fontWeight="bold">
                  {selectedFriend
                    ? `${selectedFriend.firstName} ${
                        selectedFriend.lastName || ""
                      }`
                    : "Select a friend"}
                </Typography>
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>

            {/* Messages */}
            <Stack
              spacing={2}
              sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 2 }}
            >
              {(chats[selectedFriend?._id] || []).map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf:
                      msg.senderId === currentUser._id
                        ? "flex-end"
                        : "flex-start",
                    maxWidth: "75%",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor:
                        msg.senderId === currentUser._id
                          ? "#AFA8F0"
                          : "#FFD5C2",
                      px: 2,
                      py: 1,
                      borderRadius: "15px",
                    }}
                  >
                    <Typography>{msg.text}</Typography>
                  </Box>

                  {msg.pin && (
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
                        setModalPin(msg.pin);
                        setShowModal(true);
                      }}
                    >
                      <img
                        src={msg.pin.image}
                        alt={msg.pin.title}
                        style={{ width: "100%", borderRadius: "12px" }}
                      />
                      <Typography mt={1} fontWeight="bold">
                        {msg.pin.title}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>

            {/* Input */}
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
