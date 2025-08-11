import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import Navbar from "./Navbar";
import NavbarHome from "./Navbarhome";
import Grid from "./Grid";
import SearchPage from "./SearchPage";
import ProfilePage from "./ProfilePage";
import Chatbox from "./Chatbox";
import Homepage from "./Homepage/HomePage";
import LoginPage from "./LogIn";
import SignUpForm from "./SignUpPage";
import "./App.css";
import clothesWomenData from "./data/clothesWomen";
import clothesMenData from "./data/clothesMen";

import { Analytics } from "@vercel/analytics/react";

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
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isMale, setIsMale] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const showNavbarHome = ["/", "/login", "/signup"].includes(location.pathname);
  const hideMainNavbar = location.pathname === "/search";

  const handleToggleGender = () => {
    setIsMale((prev) => !prev);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/search");
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle("modal-open", isChatOpen);
  }, [isChatOpen]);

  return (
    <>
      <ScrollToTop />

      {showNavbarHome && <NavbarHome />}

      {!showNavbarHome && !hideMainNavbar && user && (
        <Navbar
          onSearch={handleSearch}
          onChatClick={handleChatClick}
          onToggleGender={handleToggleGender}
          isMale={isMale}
          user={user}
        />
      )}

      {isChatOpen && (
        <>
          <div className="chatbox-overlay" onClick={handleCloseChat}></div>
          <Chatbox onClose={handleCloseChat} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/grid" element={<HomePageGrid isMale={isMale} />} />
        <Route
          path="/search"
          element={<SearchPage query={searchQuery} isMale={isMale} />}
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Analytics />
    </>
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
