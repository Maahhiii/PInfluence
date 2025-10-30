import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./Card";
import Modal from "./Modal";
import Navbar from "./Navbar";
import "./Grid.css";
import { Box, Typography, Fade } from "@mui/material";
import axios from "axios";

function Grid({ isMale: genderProp }) {
  const [pins, setPins] = useState([]);
  const [visiblePins, setVisiblePins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMale, setIsMale] = useState(genderProp ?? true);

  /* ✅ Load logged-in user */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* ✅ Fetch data exactly as in MongoDB */
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/pins");
        // Ensure images use the same path stored in DB
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

  /* ✅ Filter strictly by gender (no shuffle, no reordering) */
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

  /* ✅ Infinite scroll: append same set for preview illusion */
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

  /* ✅ Card click handling */
  const handleCardClick = (pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  /* ✅ Gender toggle */
  const handleToggleGender = () => setIsMale((prev) => !prev);

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
      <Navbar onToggleGender={handleToggleGender} isMale={isMale} user={user} />

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
              <Fade
                in={true}
                timeout={600}
                key={pin._id}
              >
                <Box>
                  <Card card={pin} onClick={handleCardClick} />
                </Box>
              </Fade>
            ))}
          </Masonry>
        </InfiniteScroll>

        <Modal isOpen={isModalOpen} onClose={closeModal} card={selectedPin} />
      </div>
    </>
  );
}

export default Grid;
