import Pin from "../models/Pin.js";
import User from "../models/User.js";
import Board from "../models/Board.js";

export const createPin = async (req, res) => {
  try {
    const { title, description, shopLink, tags = [], category = "unisex", boardId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Pin image required" });

    const imagePath = `/uploads/pins/${req.file.filename}`;
    const pin = await Pin.create({
      title,
      description,
      image: imagePath,
      shopLink,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean),
      category,
      createdBy: req.user._id
    });

    // add to user's pins
    const user = await User.findById(req.user._id);
    user.pins.push(pin._id);
    await user.save();

    // optionally add to a board
    if (boardId) {
      const board = await Board.findById(boardId);
      if (board) {
        board.pins.push(pin._id);
        await board.save();
      }
    }

    res.status(201).json(pin);
  } catch (err) {
    console.error("createPin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPins = async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 }).populate("createdBy", "firstName lastName profilePic");
    res.json(pins);
  } catch (err) {
    console.error("getPins error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id).populate("createdBy", "firstName lastName profilePic");
    if (!pin) return res.status(404).json({ message: "Pin not found" });
    res.json(pin);
  } catch (err) {
    console.error("getPinById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });
    if (pin.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    await Pin.findByIdAndDelete(req.params.id);

    // remove from user.pins and any boards
    await User.findByIdAndUpdate(req.user._id, { $pull: { pins: pin._id } });
    await Board.updateMany({ pins: pin._id }, { $pull: { pins: pin._id } });

    res.json({ message: "Pin deleted" });
  } catch (err) {
    console.error("deletePin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchPins = async (req, res) => {
  try {
    const q = req.query.query || "";
    const regex = new RegExp(q, "i");
    // search tags or title or description
    const pins = await Pin.find({
      $or: [{ title: regex }, { description: regex }, { tags: regex }]
    }).sort({ createdAt: -1 });
    res.json(pins);
  } catch (err) {
    console.error("searchPins error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
