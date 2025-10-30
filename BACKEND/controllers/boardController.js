import Board from "../models/Board.js";
import User from "../models/User.js";
import Pin from "../models/Pin.js";

export const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const cover = req.file ? `/uploads/boardCovers/${req.file.filename}` : undefined;

    const board = await Board.create({
      name,
      description,
      createdBy: req.user._id,
      coverImage: cover
    });

    const user = await User.findById(req.user._id);
    user.boards.push(board._id);
    await user.save();

    res.status(201).json(board);
  } catch (err) {
    console.error("createBoard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({ createdBy: req.user._id }).populate("pins");
    res.json(boards);
  } catch (err) {
    console.error("getUserBoards error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addPinToBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { pinId } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    if (!board.pins.includes(pinId)) {
      board.pins.push(pinId);
      await board.save();
    }

    // Optionally populate pins before sending
    await board.populate({
      path: "pins",
      populate: { path: "createdBy", select: "firstName lastName profilePic" }
    }).execPopulate?.();

    res.json(board);
  } catch (err) {
    console.error("addPinToBoard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// NEW: remove pin from board
export const removePinFromBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { pinId } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    board.pins = board.pins.filter((p) => p.toString() !== pinId.toString());
    await board.save();

    // Optionally populate
    await board.populate({
      path: "pins",
      populate: { path: "createdBy", select: "firstName lastName profilePic" }
    }).execPopulate?.();

    res.json(board);
  } catch (err) {
    console.error("removePinFromBoard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate({
      path: "pins",
      populate: { path: "createdBy", select: "firstName lastName profilePic" }
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    console.error("getBoardById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
