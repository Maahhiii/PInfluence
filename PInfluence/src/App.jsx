import React, { useState } from "react";
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
import Chatbox from "./Chatbox";

function HomePage({ isMale }) {
  const cards = isMale ? clothesMenData : clothesWomenData;
  return <Grid cards={cards} />;
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

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
