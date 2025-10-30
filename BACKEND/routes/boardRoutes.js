import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { makeUploader } from "../middleware/uploadMiddleware.js";
import {
  createBoard,
  getUserBoards,
  addPinToBoard,
  getBoardById
} from "../controllers/boardController.js";

const router = express.Router();

router.post("/create", protect, makeUploader("boardCovers", "cover"), createBoard);
router.get("/", protect, getUserBoards);
router.post("/:boardId/add-pin", protect, addPinToBoard);
router.get("/:boardId", protect, getBoardById);

export default router;
