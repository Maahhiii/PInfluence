import React from "react";
import { Box, Typography, Stack, Paper, TextField, IconButton, Button } from "@mui/material";
import { Send, Image } from "@mui/icons-material";

const ChatWindow = ({ messages, newMessage, setNewMessage, handleSend }) => {
  return (
    <Box sx={{ flex: 1, p: 3, bgcolor: "#FFF6E3", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" mb={2} sx={{ fontWeight: "bold", color: "#6B3FA0" }}>
        Chat
      </Typography>

      <Stack spacing={2} flex={1} overflow="auto">
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            {msg.text && (
              <Paper
                elevation={4}
                sx={{
                  bgcolor: msg.sender === "user" ? "#AFA8F0" : "#FFD5C2",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  mb: 1,
                }}
              >
                {msg.text}
              </Paper>
            )}
            {msg.pin && (
              <Paper
                elevation={4}
                sx={{
                  bgcolor: "#FC9CE3",
                  p: 2,
                  borderRadius: 3,
                  maxWidth: 300,
                }}
              >
                <img
                  src={msg.pin.image}
                  alt={msg.pin.title}
                  style={{ width: "100%", borderRadius: "12px" }}
                />
                <Typography mt={1} fontWeight={500}>
                  {msg.pin.title}
                </Typography>
                <Button
                  variant="contained"
                  href={msg.pin.link}
                  target="_blank"
                  sx={{ mt: 1, bgcolor: "#C6E7FF", color: "#000" }}
                >
                  View
                </Button>
              </Paper>
            )}
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "white",
          borderRadius: 3,
          p: 1,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <IconButton>
          <Image sx={{ color: "#AFA8F0" }} />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="standard"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          InputProps={{ disableUnderline: true, sx: { px: 1 } }}
        />
        <IconButton onClick={handleSend}>
          <Send sx={{ color: "#AFA8F0" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;
