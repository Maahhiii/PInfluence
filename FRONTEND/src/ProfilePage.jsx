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
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: null,
  });
  const [newBoard, setNewBoard] = useState(null);
  const navigate = useNavigate();

  /* Fetch logged-in user */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setBoards(res.data.boards || []);
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /* Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* Save edited profile */
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("email", editData.email);
      if (editData.avatar) formData.append("avatar", editData.avatar);

      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data);
      setIsEditOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  /* Add new board */
  const handleAddBoard = async () => {
    if (!newBoard) return alert("Please upload an image.");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", newBoard);

      const res = await axios.post(
        "http://localhost:5000/api/users/add-board",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBoards(res.data.boards);
      setNewBoard(null);
      setIsBoardModalOpen(false);
      alert("Board added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding board.");
    }
  };

  if (loading) {
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
  }

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
          src={user.avatar ? `http://localhost:5000/${user.avatar}` : "/profile/avatar.png"}
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
        <Typography variant="h5" fontWeight={600} sx={{ color: "#1E1E1E" }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography sx={{ color: "#666" }}>@{user.email}</Typography>

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
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) handleLogout();
            }}
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
          {boards.map((img, i) => (
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
            >
              <img
                src={`http://localhost:5000/${img}`}
                alt={`board-${i}`}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
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
                fontWeight: "600",
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
            type="email"
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

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 3, borderRadius: "20px", fontWeight: 600 }}
          >
            Upload Image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => setNewBoard(e.target.files[0])}
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
    </Box>
  );
};

export default ProfilePage;
