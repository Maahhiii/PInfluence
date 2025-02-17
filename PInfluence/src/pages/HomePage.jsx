import React from "react";
import "./HomePage.css"; // Import the CSS file

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="navbar flex justify-between items-center max-w-full px-4">
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

      {/* Pins Grid */}
      <div className="pins-grid">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="image-container">
            <img
              src={`https://picsum.photos/300?random=${index}`}
              alt="Pin"
              className="w-full h-60 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
