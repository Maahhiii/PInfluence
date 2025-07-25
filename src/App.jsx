import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Grid from "./Grid";
import Navbar from "./Navbar";
import SearchPage from "./SearchPage";
import clothesWomenData from "./data/clothesWomen";
import clothesMenData from "./data/clothesMen";
import "./App.css";
import ProfilePage from './ProfilePage';
import Chatbox from "./Chatbox";
import Homepage from "./Homepage/HomePage";
import Navbarhome from "./Navbarhome";
import LoginPage from "./LogIn";
import SignUpForm from "./SignUpPage";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function HomePageGrid({ isMale }) {
  const cards = isMale ? clothesMenData : clothesWomenData;
  const shuffledCards = shuffleArray(cards);
  return <Grid cards={shuffledCards} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppWrapper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMale, setIsMale] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      navigate("/search");
    }
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleToggleGender = () => {
    setIsMale((prev) => !prev);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const goToSearchPage = () => {
    if (isLoggedIn) {
      navigate("/search");
    } else {
      navigate("/login");
    }
  };

  const loadMore = () => {
    console.log('Loading more items...');
    setTimeout(() => {
      const nextCards = shuffleCards(
        cards.filter(card => !filter || card.category === filter)
      ).slice(0, 15);
      
      setAllCards(prev => [...prev, ...nextCards]);
      setVisibleCount(prev => prev + nextCards.length);
    }, 800);
  };
  

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      document.body.style.overflow = 'auto'; // Restore scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // Cleanup when component unmounts
    };
  }, [isChatOpen]);

  return (
    <div className="App">

      {/* Conditionally render Navbar based on the current location */}
      {location.pathname !== "/search" && (
        isLoggedIn ? (
          <Navbar
            onSearch={handleSearch}
            onChatClick={handleChatClick}
            onToggleGender={handleToggleGender}
            isMale={isMale}
          />
        ) : (
          <Navbarhome onSearch={handleSearch} />
        )
      )}

      <Routes>
        <Route path="/" element={isLoggedIn ? <HomePageGrid isMale={isMale} /> : <Homepage />} />
        <Route path="/grid" element={<HomePageGrid isMale={isMale} />} />
        <Route path="/search" element={<SearchPage searchTerm={searchTerm} isMale={isMale} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUpForm setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>

      {isChatOpen && (
        <div
          className="chatbox-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 0,
            margin: 0,             // 🔧 this too
            borderRadius: '0px',   
          }}
          onClick={closeChat}
        >
          <div
            className="chatbox-modal"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              maxHeight: '90vh',
              height: '90vh',
              borderRadius: '20px', // 🔧 remove rounding
              margin: 0,            // 🔧 remove spacing
              padding: 0,
              overflow: 'hidden',
              zIndex: 1400,
              backgroundColor: '#fff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Chatbox onClose={closeChat} />
          </div>
        </div>
      )}
    </div>
  );
}



function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
