import { useState, useEffect } from "react";
import "./Navbar.css"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Left side: Logo and Brand Name */}
        <div className="logo">
          <img src="/PInfluence-logo.png" alt="PInfluence Logo" className="logo-img" />
          <span className="brand-name">PInfluence</span>
        </div>

        {/* Right side: Sign In & Log In Buttons */}
        <div className="right-container">
          <button className="btn sign-in">Sign Up</button>
          <button className="btn log-in">Log In</button>
        </div>
      </div>
    </nav>
  );
}
