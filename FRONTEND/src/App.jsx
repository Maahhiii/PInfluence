  import React, { useEffect, useState } from "react";
  import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
  } from "react-router-dom";
  import axios from "axios";

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
  import { Analytics } from "@vercel/analytics/react";
  import BoardPage from "./BoardPage";

  /* ---------------------- SCROLL TO TOP ---------------------- */
  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  /* ---------------------- PROTECTED ROUTE ---------------------- */
  function ProtectedRoute({ user, loadingUser, children }) {
    if (loadingUser) {
      return (
        <div
          style={{
            textAlign: "center",
            marginTop: "25vh",
            fontSize: "1.2rem",
            color: "#555",
          }}
        >
          Checking your session...
        </div>
      );
    }

    return user ? children : <Navigate to="/login" replace />;
  }

  /* ---------------------- MAIN APP WRAPPER ---------------------- */
  function AppWrapper() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isMale, setIsMale] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    /* ✅ Restore user session on page refresh */
    useEffect(() => {
      const initUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoadingUser(false);
          return;
        }

        try {
          const { data } = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          console.error(
            "Session expired or invalid:",
            err.response?.data || err.message
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        } finally {
          setLoadingUser(false);
        }
      };

      initUser();
    }, []);

    /* ✅ Handle redirect from /login to /grid after successful login */
    useEffect(() => {
      if (user && location.pathname === "/login") {
        navigate("/grid");
      }
    }, [user, location.pathname, navigate]);

    /* Navbar visibility logic */
    const showNavbarHome = ["/", "/login", "/signup"].includes(location.pathname);
    const hideMainNavbar = ["/search", "/grid"].includes(location.pathname); // optional tweak

    const handleToggleGender = () => setIsMale((prev) => !prev);
    const handleSearch = (query) => {
      setSearchQuery(query);
      navigate("/search");
    };

    const handleChatClick = () => setIsChatOpen(true);
    const handleCloseChat = () => setIsChatOpen(false);

    useEffect(() => {
      document.body.classList.toggle("modal-open", isChatOpen);
    }, [isChatOpen]);

    if (loadingUser) {
      return (
        <div
          style={{
            textAlign: "center",
            marginTop: "25vh",
            fontSize: "1.2rem",
            color: "#555",
          }}
        >
          Checking your session...
        </div>
      );
    }

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
            setUser={setUser}
          />
        )}

        {isChatOpen && (
          <>
            <div className="chatbox-overlay" onClick={handleCloseChat}></div>
            <Chatbox onClose={handleCloseChat} />
          </>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected Routes */}
          <Route
            path="/grid"
            element={
              <ProtectedRoute user={user} loadingUser={loadingUser}>
                <Grid isMale={isMale} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute user={user} loadingUser={loadingUser}>
                <SearchPage query={searchQuery} isMale={isMale} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} loadingUser={loadingUser}>
                <ProfilePage user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/board/:id" element={<BoardPage />} />
        </Routes>

        <Analytics />
      </>
    );
  }

  /* ---------------------- MAIN APP ---------------------- */
  function App() {
    return (
      <Router>
        <AppWrapper />
      </Router>
    );
  }

  export default App;
