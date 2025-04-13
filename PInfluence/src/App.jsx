import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Grid from './Grid';
import Navbar from './Navbar';
import HomePage from './Homepage/HomePage';
import LoginPage from './LogIn'; // ✅ Make sure this is the correct path
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const signUpRef = useRef(null);

  const scrollToSignUp = () => {
    signUpRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      fetchImages();
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="App">
        <Navbar scrollToSignUp={scrollToSignUp} />
        <Routes>
          <Route path="/" element={
            !isLoggedIn ? (
              <HomePage signUpRef={signUpRef} />
            ) : (
              <Grid cards={cards} />
            )
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
