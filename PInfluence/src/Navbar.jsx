// src/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";

export default function Navbar({ onSearch, onChatClick, onToggleGender, isMale, scrollToSignUp }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (location.pathname !== "/login") navigate("/login");
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") navigate("/");
  };

  const goToSearchPage = () => navigate("/search");

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FFF6E3",
        boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        top: 0,
        zIndex: 1100,
        transition: "box-shadow 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: 2,
          py: 1,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/PInfluence-logo.png"
          alt="PInfluence Logo"
          onClick={handleLogoClick}
          sx={{
            width: { xs: "140px", sm: "160px", md: "190px" },
            height: { xs: "50px", sm: "60px", md: "70px" },
            transition: "transform 0.3s ease-in-out",
            padding: "5px",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />

        {/* Right Side Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 1,
            marginTop: { xs: 1, sm: 0 },
          }}
        >
          <Tooltip title="Search" arrow>
            <IconButton onClick={goToSearchPage} sx={{ color: "#2E1065" }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Button
            onClick={onChatClick}
            variant="contained"
            sx={{
              backgroundColor: "#CDC1FF",
              color: "#2E1065",
              borderRadius: "50px",
              padding: "6px 14px",
              fontWeight: "bold",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#b9adf7",
                transform: "scale(1.05)",
              },
            }}
          >
            Chat
          </Button>

          <Button
            onClick={onToggleGender}
            variant="contained"
            sx={{
              backgroundColor: "#F9EF9F",
              color: "#2E1065",
              borderRadius: "50px",
              padding: "6px 12px",
              fontWeight: "bold",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#e8dd88",
                transform: "scale(1.05)",
              },
            }}
          >
            {isMale ? "Women" : "Men"}
          </Button>

          <Button
            component={Link}
            to="/profile"
            variant="contained"
            sx={{
              backgroundColor: "#AFA8F0",
              color: "#fff",
              borderRadius: "20px",
              padding: "6px 16px",
              fontWeight: 600,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#9b94e0",
              },
            }}
          >
            Profile
          </Button>

          <Button
            variant="contained"
            onClick={scrollToSignUp}
            sx={{
              backgroundColor: "#e692c3",
              color: "#FFF",
              borderRadius: "50px",
              padding: "8px 16px",
              fontSize: "16px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#b47399",
                transform: "scale(1.05)",
              },
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="contained"
            onClick={handleLoginClick}
            sx={{
              backgroundColor: "#9698d3",
              color: "#FFF",
              borderRadius: "50px",
              padding: "8px 16px",
              fontSize: "16px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#7375a2",
                transform: "scale(1.05)",
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
