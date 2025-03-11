import React from 'react';
import Navbar from '../components/Navbar';
import ImageGrid from '../components/ImageGrid';

const images = [
  { src: '/Images/d1.jpg', alt: 'Description 1' },
  { src: '/Images/d2.jpg', alt: 'Description 2' },
  // Add more images as needed
];

const Home = () => {
  return (
    <>
    <div className="bg-red-500 text-white text-xl p-4">Tailwind is working!</div>

      <Navbar />
      <ImageGrid images={images} />
    </>
  );
};

export default Home;
