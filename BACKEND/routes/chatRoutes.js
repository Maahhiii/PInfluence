import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/:userId", protect, getMessages);

export default router;
