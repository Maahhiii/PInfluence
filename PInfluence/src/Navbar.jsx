import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import "./Navbar.css";

export default function Navbar({ onSearch, onChatClick, onToggleGender, isMale }) {
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
        <div className="logo">
          <img src="/PInfluence-logo.png" alt="PInfluence Logo" className="logo-img" />
          <span className="brand-name">PInfluence</span>
        </div>

        <div className="right-container">
          <Tooltip title="Search" arrow>
            <IconButton onClick={goToSearchPage} sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

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

          <button
            onClick={onToggleGender}
            className="btn toggle-gender-btn"
            style={{
              backgroundColor: "#F9EF9F",
              color: "#2E1065",
              padding: "6px 12px",
              borderRadius: "20px",
              marginLeft: "10px",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            {isMale ? "Women" : "Men"}
          </button>

          <button className="btn sign-in">Sign Up</button>
          <button className="btn log-in">Log In</button>
        </div>
      </div>
    </nav>
  );
}
