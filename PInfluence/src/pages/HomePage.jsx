import React from "react";
import "./HomePage.css"; // Import your CSS file

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">PInfluence</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-lg w-1/3 focus:outline-none"
        />
      </nav>

      {/* Pins Grid (Masonry Layout using CSS columns) */}
      <div className="p-4 pins-grid">
        {/* Placeholder Pins */}
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300 mb-4"
            style={{ breakInside: "avoid" }}
          >
            <img
              src={`https://picsum.photos/300?random=${index}`}
              alt="Pin"
              className="w-full object-cover"
              style={{
                height: `${Math.floor(Math.random() * (350 - 250 + 1)) + 250}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
