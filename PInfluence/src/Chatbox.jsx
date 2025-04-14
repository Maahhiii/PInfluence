import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, IconButton, Typography, Avatar, Stack, Button } from "@mui/material";
import { Send, EmojiEmotions } from "@mui/icons-material";
import { motion } from "framer-motion";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";


const friends = ["Emma", "Liam", "Sophia", "Noah", "Olivia"];

const initialChats = {
  Emma: [
    { sender: "Emma", text: "Hey! Look at this dress.", pin: {
      image: "/images/c14.jpg", title: "Floral Dress", link: "https://shop.com/floral-dress"
    }},
    { sender: "You", text: "Hey Emma!" }
  ],
  Liam: [{ sender: "Liam", text: "Check out these shoes!" }],
  Sophia: [{ sender: "Sophia", text: "Want to bake something today?" }],
  Noah: [{ sender: "Noah", text: "Gaming night?" }],
  Olivia: [{ sender: "Olivia", text: "This bag is so cute!" }]
};

const Chatbox = ({ onClose }) => {
  const [selectedFriend, setSelectedFriend] = useState("Emma");
  const [chats, setChats] = useState(initialChats);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("modal-open");
    scrollToBottom();
    return () => document.body.classList.remove("modal-open");
  }, [selectedFriend, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { sender: "You", text: message.trim() };
    setChats(prev => ({
      ...prev,
      [selectedFriend]: [...prev[selectedFriend], newMessage]
    }));
    setMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "relative",
        
        transform: "translate(-50%, -50%)",
        height: "90vh",
        width: "90vw",
        maxWidth: "1000px",
        zIndex: 9999,
        display: "flex",
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)"
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: "250px",
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
          {friends.map(friend => (
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
                bgcolor: selectedFriend === friend ? "#C6E7FF" : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#D8F1FF"
                }
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
                  borderBottomRightRadius: msg.sender === "You" ? "0px" : "15px",
                  borderBottomLeftRadius: msg.sender === "You" ? "15px" : "0px",
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
                    maxWidth: "350px", // 👈 Adjust this to your liking
                  }}
                >

                  <img
                    src={msg.pin.image}
                    alt={msg.pin.title}
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                  <Typography mt={1} fontWeight="bold">{msg.pin.title}</Typography>
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
  );
};

export default Chatbox;
