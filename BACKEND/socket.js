import { Server } from "socket.io";

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ ${userId} joined their room`);
  });

  socket.on("send_message", ({ receiverId, message }) => {

    io.to(receiverId).emit("receive_message", message);

    io.to(message.sender).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export default io;
