import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getConversationWithUser, sendMessage } from "../controllers/chatController.js";
import { makeUploader } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getConversationWithUser);
router.post("/send", protect, makeUploader("chatImages", "image"), sendMessage);

export default router;
