import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">Pinfluence</div>
        <div className="space-x-4">
          <a href="#about" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-800">Contact</a>
          <a href="#login" className="text-gray-600 hover:text-gray-800">Login</a>
          <a href="#signup" className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Sign Up</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
