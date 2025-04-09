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
import clothesWomenData from "./data/clothesWomen";
import "./App.css";
import Chatbox from "./Chatbox";

function HomePage() {
  return <Grid cards={clothesWomenData} />;
}

function AppWrapper() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ New state
  const navigate = useNavigate();
  const location = useLocation();

  function AppWrapper() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
  
    // ✅ Add this useEffect to control page scroll
    useEffect(() => {
      if (isChatOpen) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    }, [isChatOpen]);
  }

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
        <Navbar onSearch={handleSearch} onChatClick={handleChatClick} />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage searchTerm={searchTerm} />} />
      </Routes>

      {/* ✅ Render Chatbox as modal */}
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
