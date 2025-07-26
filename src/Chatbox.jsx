import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import { Send, EmojiEmotions } from "@mui/icons-material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const friends = ["Emma", "Liam", "Sophia", "Noah", "Olivia"];

const initialChats = {
  Emma: [
    {
      sender: "Emma",
      text: "Hey! Just found this floral dress. So pretty, right?",
      pin: {
        image: "/images/c14.jpg",
        title: "Floral Summer Dress",
        link: "https://shop.com/floral-dress",
      },
    },
    {
      sender: "You",
      text: "Hey Emma! Wow, that dress is gorgeous. Perfect for brunch!",
    },
  ],
  Liam: [
    {
      sender: "Liam",
      text: "Yo, thinking of getting these sneakers. What do you think?",
      pin: {
        image: "/clothes_men/img_database/s2.jpg",
        title: "AirZoom Max Sneakers",
        link: "https://shop.com/airzoom-max",
      },
    },
    { sender: "You", text: "Those look awesome! Totally your vibe." },
  ],
  Sophia: [
    {
      sender: "Sophia",
      text: "Let’s bake cookies today 🍪 I found a cute recipe online!",
    },
    { sender: "You", text: "Yess please! I’ll get the chocolate chips 😋" },
  ],
  Noah: [
    {
      sender: "Noah",
      text: "Game night at 9? I’ve set up the lobby already!",
    },
    { sender: "You", text: "Count me in! Let’s crush it 🔥" },
  ],
  Olivia: [
    {
      sender: "Olivia",
      text: "OMG look at this bag!! I’m obsessed 😍",
      pin: {
        image: "/clothes_women/Img_database/p2.jpg",
        title: "Vintage Leather Tote",
        link: "https://shop.com/vintage-tote",
      },
    },
    { sender: "You", text: "Oooh that’s classy. You should totally get it!" },
  ],
};

const Chatbox = ({ onClose }) => {
  const [selectedFriend, setSelectedFriend] = useState("Emma");
  const [chats, setChats] = useState(initialChats);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable background scroll
    scrollToBottom();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFriend, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { sender: "You", text: message.trim() };
    setChats((prev) => ({
      ...prev,
      [selectedFriend]: [...prev[selectedFriend], newMessage],
    }));
    setMessage("");
  };

  return (
    <Box
      onClick={onClose} // background click closes modal
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // prevent close when modal is clicked
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          height: "92vh",
          width: "60vw",
          display: "flex",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
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
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
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
            {friends.map((friend) => (
              <Box
                key={friend}
                onClick={() => setSelectedFriend(friend)}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor:
                    selectedFriend === friend ? "#C6E7FF" : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#D8F1FF",
                  },
                }}
              >
                <Avatar sx={{ bgcolor: "#FFF6E3", color: "#333" }} />
                <Typography fontWeight="bold">{friend}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Chat area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#FFF6E3",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            overflow: "hidden",
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
              borderTopRightRadius: "20px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "#FFF6E3", color: "#333" }} />
              <Typography variant="h6" fontWeight="bold">
                {selectedFriend}
              </Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* Messages */}
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              px: 3,
              py: 2,
            }}
          >
            {(chats[selectedFriend] || []).map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.sender === "You" ? "#AFA8F0" : "#FFD5C2",
                    color: "#333",
                    px: 2,
                    py: 1,
                    borderRadius: "15px",
                    borderBottomRightRadius:
                      msg.sender === "You" ? "0px" : "15px",
                    borderBottomLeftRadius:
                      msg.sender === "You" ? "15px" : "0px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      p: 1,
                      maxWidth: "350px",
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
                    <Button
                      variant="contained"
                      href={msg.pin.link}
                      target="_blank"
                      sx={{
                        mt: 1,
                        bgcolor: "#C6E7FF",
                        color: "#000",
                        borderRadius: "999px",
                        fontWeight: 500,
                        textTransform: "none",
                        px: 3,
                        "&:hover": {
                          bgcolor: "#AFA8F0",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

          {/* Message Input */}
          <Box
            sx={{
              px: 2,
              pb: 2,
              pt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#fff",
              boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
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
              InputProps={{
                disableUnderline: true,
                sx: { px: 2 },
              }}
            />
            <IconButton onClick={handleSendMessage}>
              <Send sx={{ color: "#AFA8F0" }} />
            </IconButton>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Chatbox;
