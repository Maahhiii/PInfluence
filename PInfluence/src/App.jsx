import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Navbar from './Navbar';
import HomePage from './Homepage/HomePage';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔐 Track login

  useEffect(() => {
    const fetchImages = () => {
      const images = [
        { 
          image: '/images/image1.jpg', 
          title: 'Pink Oversized Coat',
          brand: 'Fashion Nova',
          shopLink: 'https://example.com/pink-coat'
        },
        { 
          image: '/images/image2.jpg', 
          title: 'White Knit Dress',
          brand: 'Zara',
          shopLink: 'https://example.com/white-dress'
        },
        { 
          image: '/images/image3.jpg', 
          title: 'Argyle Vest with Pants',
          brand: 'H&M',
          shopLink: 'https://example.com/argyle-outfit'
        },
      ];
      const repeatedImages = Array(20).fill(images).flat();
      setCards(repeatedImages);
    };

    if (isLoggedIn) {
      fetchImages(); // only fetch when logged in
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <Navbar />
      {!isLoggedIn ? (
        <HomePage />
      ) : (
        <Grid cards={cards} />
      )}
    </div>
  );
}

export default App;
