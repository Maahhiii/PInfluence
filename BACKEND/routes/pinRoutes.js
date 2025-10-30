import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { makeUploader } from "../middleware/uploadMiddleware.js";
import {
  createPin,
  getPins,
  getPinById,
  deletePin,
  searchPins
} from "../controllers/pinController.js";

const router = express.Router();

// public listing & search
router.get("/", getPins);
router.get("/search", searchPins);
router.get("/:id", getPinById);

// protected pin creation/deletion
router.post("/add", protect, makeUploader("pins", "image"), createPin);
router.delete("/:id", protect, deletePin);

export default router;
