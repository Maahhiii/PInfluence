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
  const { isMale: genderProp, onChatClick, user, boards, setBoards } = props;

  const [pins, setPins] = useState([]);
  const [visiblePins, setVisiblePins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMale, setIsMale] = useState(genderProp ?? true);

  // ✅ If SearchPage sent specific cards, use them instead of fetching all pins
  useEffect(() => {
    if (props.cards && props.cards.length > 0) {
      const normalized = props.cards.map((pin) => ({
        ...pin,
        image: pin.image.startsWith("http")
          ? pin.image
          : `http://localhost:5000${pin.image}`,
      }));

      setPins(normalized);
      setVisiblePins(normalized);
      setLoading(false);
    }
  }, [props.cards]);

  // ✅ Update when parent changes gender
  useEffect(() => {
    setIsMale(genderProp);
  }, [genderProp]);

  // ✅ NEW: for sharing mode
  const [shareMode, setShareMode] = useState(false);
  const [friends, setFriends] = useState([]);

  /* ✅ Fetch friends (actual backend route fix) */

  useEffect(() => {
    const fetchFriends = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token, skipping friends fetch");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/users/friends/${storedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFriends(res.data || []);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
  }, []);

  /* ✅ Fetch pins from backend */
  useEffect(() => {
    if (props.cards && props.cards.length > 0) return;
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
  /* ✅ Filter by gender */
  useEffect(() => {
    if (pins.length > 0) {
      const category = isMale ? "men" : "women";

      const filtered = pins.filter((p) => {
        const cat = p.category?.toLowerCase().trim();

        if (!cat) return false; // no category? skip

        // valid male categories
        const maleCats = ["men", "male", "mens", "menswear", "unisex"];
        const femaleCats = [
          "women",
          "female",
          "womens",
          "girls",
          "girlswear",
          "unisex",
        ];

        return isMale ? maleCats.includes(cat) : femaleCats.includes(cat);
      });

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

  /* ✅ NEW: handle share pin */
  const handleSharePin = (pin) => {
    setSelectedPin(pin);
    setShareMode(true);
  };

  /* ✅ Send selected pin to chosen friend (corrected to pass full friend object) */
  const sendPinToFriend = (friend) => {
    if (!selectedPin) return; // make sure a pin is selected

    const event = new CustomEvent("send-pin", {
      detail: {
        friendId: friend._id, // ✅ make sure real id sent
        friend: {
          _id: friend._id,
          name: `${friend.firstName} ${friend.lastName || ""}`,
          profilePic: friend.profilePic || friend.avatar,
        },
        pin: {
          _id: selectedPin._id,
          image: selectedPin.image,
          title: selectedPin.title,
          shopLink: selectedPin.shopLink || "#",
        },
      },
    });
    window.dispatchEvent(event);

    // optionally close the share overlay
    setShareMode(false);
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
      {/* <Navbar
        onToggleGender={handleToggleGender}
        isMale={isMale}
        user={user}
        onChatClick={onChatClick}
      /> */}

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

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          card={selectedPin}
          currentUser={user}
          friends={friends}
          boards={boards}
          setBoards={setBoards}
        />

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
