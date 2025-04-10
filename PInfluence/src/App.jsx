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
import clothesWomenData from "./data/clothesWomen";
import clothesMenData from "./data/clothesMen"; // ✅ New Import
import Chatbox from "./Chatbox";
import "./App.css";

function HomePage({ isMenMode }) {
  const cards = isMenMode ? clothesMenData : clothesWomenData;
  return <Grid cards={cards} />;
}

// Men's page for Men's collection
function MenPage() {
  return <Grid cards={clothesMenData} />;
}

// Search page with dynamic results (currently filters women's data)
function SearchPage({ searchTerm }) {
  const filteredCards = clothesWomenData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <Grid cards={filteredCards} />;
}

// Main AppWrapper component with search and chat logic
function AppWrapper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isChatOpen]);

  const [isMenMode, setIsMenMode] = useState(false);

  const handleToggleGender = () => {
    setIsMenMode((prev) => !prev);
  };


  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      navigate("/search");
    }
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="App">
      {location.pathname !== "/search" && (
        <Navbar onSearch={handleSearch} onChatClick={handleChatClick} 
        onToggleGender={handleToggleGender}
        isMenMode={isMenMode}/>
      )}

      <Routes>
        <Route path="/" element={<HomePage isMenMode={isMenMode} />} />

        <Route path="/men" element={<MenPage />} /> {/* ✅ Men route */}
        <Route
          path="/search"
          element={<SearchPage searchTerm={searchTerm} />}
        />
      </Routes>

      {isChatOpen && (
        <div className="chatbox-overlay" onClick={closeChat}>
          <div className="chatbox-modal" onClick={(e) => e.stopPropagation()}>
            <Chatbox onClose={closeChat} />
          </div>
        </div>
      )}
    </div>
  );
}

// Root App component
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
