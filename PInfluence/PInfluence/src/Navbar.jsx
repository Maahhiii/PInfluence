import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-brand">PInfluence</span>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="navbar-search" />
        <button className="navbar-button">Home</button>
        <button className="navbar-button">Profile</button>
        <button className="navbar-button">Settings</button>
      </div>
    </nav>
  );
}

export default Navbar;
