import User from "../models/User.js";
import Board from "../models/Board.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "boards",
        select: "_id name coverImage",
      });
    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, username, birthdate } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.username = username ?? user.username;
    user.birthdate = birthdate ?? user.birthdate;

    await user.save();
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.user._id);
    user.profilePic = `/uploads/profilePics/${req.file.filename}`;
    await user.save();
    res.json({ profilePic: user.profilePic });
  } catch (err) {
    console.error("uploadProfilePic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (req.user._id.toString() === targetId) return res.status(400).json({ message: "Cannot follow yourself" });
    const user = await User.findById(req.user._id);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (!user.following.includes(target._id)) {
      user.following.push(target._id);
      target.followers.push(user._id);
      await user.save();
      await target.save();
    }
    res.json({ message: "Followed" });
  } catch (err) {
    console.error("followUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user._id);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== req.user._id.toString());
    await user.save();
    await target.save();
    res.json({ message: "Unfollowed" });
  } catch (err) {
    console.error("unfollowUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addBoardToUser = async (req, res) => {
  try {
    const { boardId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.boards.includes(boardId)) {
      user.boards.push(boardId);
      await user.save();
    }
    return res.json({ boards: user.boards });
  } catch (err) {
    console.error("addBoardToUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
