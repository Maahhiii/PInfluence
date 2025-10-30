import Message from "../models/Message.js";
import User from "../models/User.js";

export const getConversationWithUser = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherId },
        { sender: otherId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("getConversationWithUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const imagePath = req.file ? `/uploads/chatImages/${req.file.filename}` : undefined;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      image: imagePath
    });

    // Emit to receiver in real-time using socket.io if available
    try {
      const io = req.app.get("io");
      if (io) {
        io.to(receiverId).emit("receive_message", message);
      }
    } catch (e) {
      // ignore socket issues
      console.warn("Socket emit failed:", e);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
