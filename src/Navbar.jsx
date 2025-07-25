import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";

export default function Navbar({
  onSearch,
  onChatClick,
  onToggleGender,
  isMale,
  user,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/grid");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const goToSearchPage = () => {
    onSearch(""); 
    navigate("/search");
  };

  const IconWrapper = ({ children, bg }) => (
    <Box
      sx={{
        backgroundColor: bg,
        borderRadius: "50%",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          transform: "scale(1.1)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      {children}
    </Box>
  );

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

        {/* Right Side Icons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 1.5,
            marginTop: { xs: 1, sm: 0 },
          }}
        >
          <Tooltip title="Search" arrow>
            <IconButton onClick={goToSearchPage}>
              <IconWrapper bg="#D6C4F3">
                <SearchIcon sx={{ color: "#fff" }} />
              </IconWrapper>
            </IconButton>
          </Tooltip>

          <Tooltip title="Chat" arrow>
            <IconButton onClick={onChatClick}>
              <IconWrapper bg="#F3A9C7">
                <ChatBubbleOutlineIcon sx={{ color: "#fff" }} />
              </IconWrapper>
            </IconButton>
          </Tooltip>

          <Tooltip title={isMale ? "Switch to Women" : "Switch to Men"} arrow>
            <IconButton onClick={onToggleGender}>
              <IconWrapper bg="#F4E38E">
                <SwapHorizIcon sx={{ color: "#2E1065" }} />
              </IconWrapper>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile" arrow>
            <IconButton component={Link} to="/profile">
              <IconWrapper bg="#B7A9F4">
                <AccountCircleIcon sx={{ color: "#fff" }} />
              </IconWrapper>
            </IconButton>
          </Tooltip>

          {user && (
            <Tooltip title="Logout" arrow>
              <IconButton onClick={handleLogout}>
                <IconWrapper bg="#8C89C8">
                  <LogoutIcon sx={{ color: "#fff" }} />
                </IconWrapper>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
