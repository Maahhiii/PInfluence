import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import "./Navbar.css";
import { Link } from 'react-router-dom';

export default function Navbar({ onSearch, onChatClick, onToggleGender, isMenMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSearchPage = () => {
    navigate("/search");
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Left side: Logo and Brand Name */}
        <div className="logo">
          <img src="/PInfluence-logo.png" alt="PInfluence Logo" className="logo-img" />
          <span className="brand-name">PInfluence</span>
        </div>

        {/* Right side: Search Icon and Auth Buttons */}
        <div className="right-container">
          <Tooltip title="Search" arrow>
            <IconButton onClick={goToSearchPage} sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Toggle Button for Gender Mode */}
          <button
            onClick={onToggleGender}
            className="btn toggle-gender-btn"
            style={{
              backgroundColor: isMenMode ? "#A1E3D8" : "#FDA4BA",
              color: "#2E1065",
              padding: "6px 14px",
              borderRadius: "20px",
              marginLeft: "10px",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            {isMenMode ? "Men 👕" : "Women 👗"}
          </button>


          {/* Chat Button */}
          <button
            onClick={onChatClick}
            className="btn chat-btn"
            style={{
              backgroundColor: "#CDC1FF",
              color: "#2E1065",
              padding: "6px 14px",
              borderRadius: "20px",
              marginLeft: "10px",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            Chat
          </button>

          <button className="btn sign-in">Sign Up</button>
          <button className="btn log-in">Log In</button>
        </div>
      </div>
    </nav>
  );
}
