import React from "react";
import { Box, Typography, List, ListItemButton, Avatar, Divider } from "@mui/material";

const mockChats = [
  { id: 1, name: "Emma", avatar: "/images/avatar1.jpg" },
  { id: 2, name: "Liam", avatar: "/images/avatar2.jpg" },
  { id: 3, name: "Sophia", avatar: "/images/avatar3.jpg" },
];

const ChatList = ({ selectedId, onSelect }) => {
  return (
    <Box sx={{ width: 250, bgcolor: "#AFA8F0", height: "100vh", borderRight: "1px solid #eee" }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#6B3FA0" }}>
        Chats
      </Typography>
      <Divider />
      <List>
        {mockChats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={selectedId === chat.id}
            onClick={() => onSelect(chat.id)}
            sx={{ gap: 1 }}
          >
            <Avatar src={chat.avatar} sx={{ width: 36, height: 36 }} />
            <Typography>{chat.name}</Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
