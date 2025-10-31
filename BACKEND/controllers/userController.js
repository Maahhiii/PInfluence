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

// ✅ Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user._id);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ message: "User not found" });
    if (user._id.equals(target._id))
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });

    if (user.friends.includes(targetId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (user.sentRequests.includes(targetId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Add to outgoing and incoming lists
    user.sentRequests.push(targetId);
    target.friendRequests.push(user._id);

    await user.save();
    await target.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("sendFriendRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const senderId = req.params.id; // who sent the request
    const user = await User.findById(req.user._id);
    const sender = await User.findById(senderId);

    if (!sender) return res.status(404).json({ message: "User not found" });

    if (!user.friendRequests.includes(senderId)) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Remove from pending
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== senderId
    );
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    // Add to mutual friends
    user.friends.push(senderId);
    sender.friends.push(user._id);

    await user.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("acceptFriendRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    const user = await User.findById(req.user._id);
    const sender = await User.findById(senderId);

    if (!sender) return res.status(404).json({ message: "User not found" });

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== senderId
    );
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await user.save();
    await sender.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error("rejectFriendRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove Friend
export const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("removeFriend error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Friends
export const getUserFriends = async (req, res) => {
  try {
    const userId =
      req.params.id === "me" ? req.user._id : req.params.id;

    const user = await User.findById(userId).populate(
      "friends",
      "firstName lastName email profilePic"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (err) {
    console.error("getUserFriends error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get Pending Friend Requests
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequests",
      "firstName lastName email profilePic"
    );
    res.json(user.friendRequests);
  } catch (err) {
    console.error("getFriendRequests error:", err);
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

// ✅ Get all users (excluding self)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("firstName lastName email profilePic sentRequests friendRequests friends");

    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
