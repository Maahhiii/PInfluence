// src/App.jsx
import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Navbar from './Navbar';
import './App.css';

// function App() {
//   const [cards, setCards] = useState([]);

//   useEffect(() => {
//     const fetchImages = () => {
//       // Add more product information
//       const images = [
//         { 
//           image: '/images/image1.jpg', 
//           title: 'Pink Oversized Coat',
//           brand: 'Fashion Nova',
//           shopLink: 'https://example.com/pink-coat'
//         },
//         { 
//           image: '/images/image2.jpg', 
//           title: 'White Knit Dress',
//           brand: 'Zara',
//           shopLink: 'https://example.com/white-dress'
//         },
//         { 
//           image: '/images/image3.jpg', 
//           title: 'Argyle Vest with Pants',
//           brand: 'H&M',
//           shopLink: 'https://example.com/argyle-outfit'
//         },
//       ];
    
//       const repeatedImages = Array(20).fill(images).flat();
//       setCards(repeatedImages);
//     };

//     fetchImages();
//   }, []);

//   return (
//     <div className="App">
//       <Navbar />
//       <Grid cards={cards} />
//     </div>
//   );
// }

function App() {
  return (
    <h1 class="text-3xl font-bold underline">
    Hello world!
    </h1>
  );
}

export default App;
