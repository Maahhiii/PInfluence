import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: null,
  });
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    cover: null,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch user and boards from backend
  useEffect(() => {
    const fetchUserAndBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // 1️⃣ Get user info
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);

        // Get all users
        const usersRes = await axios.get(
          "http://localhost:5000/api/users/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllUsers(usersRes.data);

        // Incoming friend requests
        const frRes = await axios.get(
          "http://localhost:5000/api/users/friend-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFriendRequests(frRes.data);

        // Sent requests (already in user data)
        setSentRequests(res.data.sentRequests || []);

        // 2️⃣ Get friends count
        try {
          const friendsRes = await axios.get(
            `http://localhost:5000/api/users/friends/${res.data._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setFriendsCount(friendsRes.data?.length || 0);
        } catch (err) {
          console.error("Error fetching friends:", err);
        }

        // 2️⃣ Get boards for the user
        const boardsRes = await axios.get("http://localhost:5000/api/boards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(boardsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBoards();
  }, [navigate]);

  // ✅ Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // ✅ Save edited profile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Update text fields
      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2️⃣ Upload avatar if provided
      if (editData.avatar) {
        const formData = new FormData();
        formData.append("avatar", editData.avatar);

        await axios.post(
          "http://localhost:5000/api/users/upload-profile-pic",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // 3️⃣ Re-fetch updated user data
      const updatedUser = await axios.get(
        "http://localhost:5000/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(updatedUser.data);
      setIsEditOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleSendRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/users/friends/request/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Friend request sent");
      setSentRequests([...sentRequests, id]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:5000/api/users/friends/accept/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setFriendRequests(friendRequests.filter((u) => u._id !== id));
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:5000/api/users/friends/reject/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setFriendRequests(friendRequests.filter((u) => u._id !== id));
  };

  // ✅ Add new board
  const handleAddBoard = async () => {
    if (!newBoard.name || !newBoard.cover)
      return alert("Please enter a name and upload an image.");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newBoard.name);
      formData.append("description", newBoard.description || "");
      formData.append("cover", newBoard.cover); // matches backend field

      const res = await axios.post(
        "http://localhost:5000/api/boards/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBoards((prev) => [...prev, res.data]);
      setNewBoard({ name: "", description: "", cover: null });
      setIsBoardModalOpen(false);
      alert("Board created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating board.");
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!user) return null;

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#FFF6E3" }}>
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(to right, #AFA8F0, #FC9CE3)",
          position: "relative",
        }}
      >
        <Avatar
          src={
            user.profilePic
              ? `http://localhost:5000${user.profilePic}`
              : "/profile/avatar.png"
          }
          sx={{
            width: 120,
            height: 120,
            position: "absolute",
            bottom: -60,
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid white",
          }}
        />
      </Box>

      {/* Profile Info */}
      <Box sx={{ mt: 8, textAlign: "center", px: 2 }}>
        <Typography variant="h5" fontWeight={600} color="#FC9CE3">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography color="text.secondary">@{user.email}</Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 1 }}>
          <Typography variant="body2" color="#FC9CE3">
            <strong>{friendsCount}</strong>{" "}
            {friendsCount === 1 ? "Friend" : "Friends"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                avatar: null,
              });
              setIsEditOpen(true);
            }}
            sx={{
              bgcolor: "#FC9CE3",
              color: "#1E1E1E",
              borderRadius: "20px",
              px: 3,
            }}
          >
            Edit Profile
          </Button>

          <IconButton
            onClick={handleLogout}
            sx={{ bgcolor: "#AFA8F0", color: "white" }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Boards Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Typography variant="h6" color="#FC9CE3" fontWeight={600} mb={2}>
          Your Boards
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {boards.map((board, i) => (
            <Box
              key={i}
              sx={{
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(175, 168, 240, 0.3)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <img
                src={`http://localhost:5000${board.coverImage}`}
                alt={board.name}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 1,
                  fontWeight: 600,
                  color: "#1E1E1E",
                }}
              >
                {board.name}
              </Typography>
            </Box>
          ))}

          {/* Add New Board Card */}
          <Box
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(175, 168, 240, 0.3)",
              cursor: "pointer",
              height: "260px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(to right, rgba(175, 168, 240, 0.5), rgba(252, 156, 227, 0.5))",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsBoardModalOpen(true)}
              sx={{
                bgcolor: "white",
                color: "#1E1E1E",
                borderRadius: "20px",
                px: 3,
                fontWeight: 600,
              }}
            >
              Add Board
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            width: "90%",
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>

          <TextField
            fullWidth
            label="First Name"
            value={editData.firstName}
            onChange={(e) =>
              setEditData({ ...editData, firstName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={editData.lastName}
            onChange={(e) =>
              setEditData({ ...editData, lastName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 3, borderRadius: "20px", fontWeight: 600 }}
          >
            Upload New Profile Picture
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) =>
                setEditData({ ...editData, avatar: e.target.files[0] })
              }
            />
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveProfile}
            sx={{
              bgcolor: "#AFA8F0",
              color: "white",
              borderRadius: "20px",
              fontWeight: 600,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Add Board Modal */}
      <Modal open={isBoardModalOpen} onClose={() => setIsBoardModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            width: "90%",
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New Board
          </Typography>

          <TextField
            fullWidth
            label="Board Name"
            value={newBoard.name}
            onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={newBoard.description}
            onChange={(e) =>
              setNewBoard({ ...newBoard, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 3, borderRadius: "20px", fontWeight: 600 }}
          >
            Upload Cover Image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) =>
                setNewBoard({ ...newBoard, cover: e.target.files[0] })
              }
            />
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleAddBoard}
            sx={{
              bgcolor: "#AFA8F0",
              color: "white",
              borderRadius: "20px",
              fontWeight: 600,
            }}
          >
            Add Board
          </Button>
        </Box>
      </Modal>
      {/* 🔥 Friends & Requests Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Typography variant="h6" color="#FC9CE3" fontWeight={600} mb={2}>
          People You May Know
        </Typography>

        {allUsers.map((u) => {
          const alreadySent = sentRequests.includes(u._id);
          const alreadyFriend = user.friends.includes(u._id);

          return (
            <Box
              key={u._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                p: 2,
                borderRadius: "16px",
                background: "rgba(252,156,227,0.12)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={
                    u.profilePic
                      ? `http://localhost:5000${u.profilePic}`
                      : "/profile/avatar.png"
                  }
                />
                <Typography fontWeight={600}>
                  {u.firstName} {u.lastName}
                </Typography>
              </Box>

              {alreadyFriend ? (
                <Typography
                  fontSize={14}
                  sx={{ color: "#AFA8F0", fontWeight: 600 }}
                >
                  Friends
                </Typography>
              ) : alreadySent ? (
                <Typography fontSize={14} sx={{ color: "#999" }}>
                  Request Sent
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FC9CE3",
                    borderRadius: "20px",
                    color: "#1E1E1E",
                  }}
                  onClick={() => handleSendRequest(u._id)}
                >
                  Follow
                </Button>
              )}
            </Box>
          );
        })}

        {/* 📥 Received Requests */}
        <Typography variant="h6" color="#AFA8F0" fontWeight={600} mt={4} mb={2}>
          Friend Requests
        </Typography>

        {friendRequests.length === 0 && (
          <Typography sx={{ color: "#777" }}>No pending requests</Typography>
        )}

        {friendRequests.map((u) => (
          <Box
            key={u._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              mb: 2,
              borderRadius: "16px",
              background: "rgba(175,168,240,0.12)",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={
                  u.profilePic
                    ? `http://localhost:5000${u.profilePic}`
                    : "/profile/avatar.png"
                }
              />
              <Typography>
                {u.firstName} {u.lastName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                sx={{ bgcolor: "#AFA8F0", color: "white" }}
                onClick={() => handleAccept(u._id)}
              >
                Accept
              </Button>
              <Button
                size="small"
                sx={{ bgcolor: "#FF8FA3", color: "white" }}
                onClick={() => handleReject(u._id)}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProfilePage;
