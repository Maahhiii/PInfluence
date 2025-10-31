import Message from "../models/Message.js";

// ✅ Send a message (text or pin)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, pin } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text || "",
      pin: pin || null,
    });

    res.json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch chat history between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // friend’s ID
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName profilePic")
      .populate("receiver", "firstName lastName profilePic");

    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
