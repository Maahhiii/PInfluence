import React from "react";
import "./HomePage.css"; // Import the CSS file

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center px-4 py-3 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">PInfluence</h1>

        {/* Search Bar */}
        <div className="w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 w-full rounded-lg focus:outline-none"
          />
        </div>
      </nav>

      {/* Proper Pinterest-like Grid */}
      <div className="grid-container">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="grid-item">
            <img
              src={`https://picsum.photos/seed/${index}/300/${200 + (index % 3) * 50}`}
              alt="Pin"
              className="rounded-lg hover:scale-105 transition-transform duration-300 w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
