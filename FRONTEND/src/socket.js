// src/socket.js
import { io } from "socket.io-client";

// ⚙️ Use your backend URL (change if deployed)
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// Create a single socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ensure stable real-time connection
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Optional: log connection status
socket.on("connect", () => {
  console.log("🟢 Connected to socket:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from socket");
});

export default socket;
