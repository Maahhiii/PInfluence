import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// ✅ socket.io setup
const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Serve static images correctly
app.use("/clothes_men", express.static(path.join(__dirname, "public/clothes_men")));
app.use("/clothes_women", express.static(path.join(__dirname, "public/clothes_women")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("🟢 Pinfluence API running successfully!"));

// ✅ socket.io handlers
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) socket.join(userId);
  });

  socket.on("send_message", ({ receiverId, message }) => {
    if (receiverId) io.to(receiverId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
