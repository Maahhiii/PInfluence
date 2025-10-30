import express from "express";
import {
  getMe,
  updateProfile,
  uploadProfilePic,
  followUser,
  unfollowUser,
  addBoardToUser
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { makeUploader } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/upload-profile-pic", protect, makeUploader("profilePics", "avatar"), uploadProfilePic);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

// convenience route for adding board id to user (when created via boardRoutes it will also add)
router.post("/add-board", protect, addBoardToUser);

export default router;
