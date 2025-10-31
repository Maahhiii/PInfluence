import { Server } from "socket.io";
import Message from "./models/Message.js";

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Join user's personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ ${userId} joined their room`);
  });

  // Handle send_message (text or pin)
  socket.on("send_message", ({ receiverId, message }) => {
    // Message already saved by REST API ✅

    // Send to receiver
    io.to(receiverId).emit("receive_message", message);

    // Send to sender (delivery confirm)
    io.to(message.sender).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export default io;
