import React, { useState, useEffect } from "react"; // Add useEffect here
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

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function HomePage({ isMale }) {
  const cards = isMale ? clothesMenData : clothesWomenData;
  const shuffledCards = shuffleArray(cards); // ✅ Shuffle the cards

  return <Grid cards={shuffledCards} />;
}

function AppWrapper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMale, setIsMale] = useState(false);
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
      {location.pathname !== "/search" && (
        <Navbar
          onSearch={handleSearch}
          onChatClick={handleChatClick}
          onToggleGender={handleToggleGender}
          isMale={isMale}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage isMale={isMale} />} />
        <Route path="/search" element={<SearchPage searchTerm={searchTerm} isMale={isMale} />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      {isChatOpen && (
  <>
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
      }}
      onClick={closeChat}
    >
      <div
        className="chatbox-modal"
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          borderRadius: '16px',
          overflow: 'hidden',
          zIndex: 1400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Chatbox onClose={closeChat} />
      </div>
    </div>
  </>
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
