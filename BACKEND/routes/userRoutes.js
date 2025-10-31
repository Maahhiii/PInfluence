import express from "express";
import {
  getMe,
  updateProfile,
  uploadProfilePic,
  addBoardToUser,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getUserFriends,
  getFriendRequests
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { makeUploader } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User profile
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post(
  "/upload-profile-pic",
  protect,
  makeUploader("profilePics", "avatar"),
  uploadProfilePic
);

// ✅ Friend system routes
router.post("/friends/request/:id", protect, sendFriendRequest);
router.post("/friends/accept/:id", protect, acceptFriendRequest);
router.post("/friends/reject/:id", protect, rejectFriendRequest);
router.delete("/friends/remove/:id", protect, removeFriend);
router.get("/friends/:id", protect, getUserFriends);
router.get("/friend-requests", protect, getFriendRequests);

// Boards
router.post("/add-board", protect, addBoardToUser);

export default router;
