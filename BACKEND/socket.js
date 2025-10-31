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
  socket.on("send_message", async ({ receiverId, message }) => {
    try {
      // Save to DB
      const saved = await Message.create({
        sender: message.senderId,
        receiver: receiverId,
        text: message.text || "",
        pin: message.pin || null, // ⚡ Save pin object if exists
      });

      // Emit to receiver
      io.to(receiverId).emit("receive_message", {
        ...saved.toObject(),
        senderId: message.senderId,
      });

      // Optionally emit to sender to confirm delivery
      io.to(message.senderId).emit("receive_message", {
        ...saved.toObject(),
        senderId: message.senderId,
      });
    } catch (err) {
      console.error("💥 socket send_message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export default io;
