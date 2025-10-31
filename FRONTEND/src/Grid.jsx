// --- below imports ---
import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./Card";
import Modal from "./Modal";
import Navbar from "./Navbar";
import "./Grid.css";
import { Box, Typography, Fade } from "@mui/material";
import axios from "axios";

function Grid(props) {
  const { isMale: genderProp, onChatClick } = props;

  const [pins, setPins] = useState([]);
  const [visiblePins, setVisiblePins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMale, setIsMale] = useState(genderProp ?? true);

  // ✅ NEW: for sharing mode
  const [shareMode, setShareMode] = useState(false);
  const [friends, setFriends] = useState([]);

  /* ✅ Load logged-in user */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* ✅ Fetch friends (actual backend route fix) */
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/users/friends/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(res.data || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [user]);

  /* ✅ Fetch pins from backend */
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/pins");
        const normalized = data.map((pin) => ({
          ...pin,
          image: pin.image.startsWith("http")
            ? pin.image
            : `http://localhost:5000${pin.image}`,
        }));
        setPins(normalized);
      } catch (err) {
        console.error("Error fetching pins:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, []);

  /* ✅ Filter by gender */
  useEffect(() => {
    if (pins.length > 0) {
      const category = isMale ? "men" : "women";
      const filtered = pins.filter(
        (p) =>
          p.category?.toLowerCase() === category ||
          p.category?.toLowerCase() === "unisex"
      );
      setVisiblePins(filtered);
    }
  }, [pins, isMale]);

  /* ✅ Infinite scroll illusion */
  const loadMore = () => {
    setTimeout(() => {
      const category = isMale ? "men" : "women";
      const filtered = pins.filter(
        (p) =>
          p.category?.toLowerCase() === category ||
          p.category?.toLowerCase() === "unisex"
      );
      setVisiblePins((prev) => [...prev, ...filtered]);
    }, 600);
  };

  /* ✅ Handle pin click */
  const handleCardClick = (pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  /* ✅ Gender toggle */
  const handleToggleGender = () => setIsMale((prev) => !prev);

  /* ✅ NEW: handle share pin */
  const handleSharePin = (pin) => {
    setSelectedPin(pin);
    setShareMode(true);
  };

  /* ✅ Send selected pin to chosen friend (corrected to pass full friend object) */
  const sendPinToFriend = (friend) => {
    const event = new CustomEvent("send-pin", {
      detail: {
        friend: {
          _id: friend._id,
          name: `${friend.firstName} ${friend.lastName || ""}`,
          profilePic: friend.profilePic,
        },
        pin: {
          _id: card._id,
          image: card.image,
          title: card.title || "Shared Pin",
          shopLink: card.shopLink || "#",
        },
      },
    });
    window.dispatchEvent(event);
    setShowFriends(false);
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 5,
    768: 3,
    480: 1,
  };

  if (loading) {
    return (
      <Typography align="center" sx={{ py: 6, fontSize: "1.2rem" }}>
        Loading fashion pins...
      </Typography>
    );
  }

  return (
    <>
      <Navbar
        onToggleGender={handleToggleGender}
        isMale={isMale}
        user={user}
        onChatClick={onChatClick}
      />

      <div className="grid-wrapper">
        <InfiniteScroll
          dataLength={visiblePins.length}
          next={loadMore}
          hasMore={true}
          loader={
            <Typography
              align="center"
              sx={{ py: 4, color: "#FF69B4", fontWeight: 500 }}
            >
              ✨ Loading more style inspo...
            </Typography>
          }
          scrollThreshold={0.8}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {visiblePins.map((pin) => (
              <Fade in={true} timeout={600} key={pin._id}>
                <Box>
                  <Card
                    card={pin}
                    onClick={() => handleCardClick(pin)}
                    onShare={() => handleSharePin(pin)} // 👈 share button inside card
                  />
                </Box>
              </Fade>
            ))}
          </Masonry>
        </InfiniteScroll>

        <Modal isOpen={isModalOpen} onClose={closeModal} card={selectedPin} />

        {/* ✅ Share Overlay */}
        {shareMode && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setShareMode(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                bgcolor: "#fff",
                borderRadius: "16px",
                p: 3,
                minWidth: "300px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Send pin to a friend
              </Typography>
              {friends.length === 0 ? (
                <Typography>No friends found 😢</Typography>
              ) : (
                friends.map((f) => (
                  <Box
                    key={f._id}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f3f3f3" },
                    }}
                    onClick={() => sendPinToFriend(f)}
                  >
                    {f.firstName} {f.lastName}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </div>
    </>
  );
}

export default Grid;
