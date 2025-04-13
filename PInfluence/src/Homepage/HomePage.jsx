// src/Homepage/HomePage.jsx
import React from "react";
import { motion } from "framer-motion";
import RollingGallery from "./RollingGallery";
import SignUpForm from "./SignUp";
import Footer from "./Footer"; // Import the Footer component
import "./HomePage.css";

const sections = [
  {
    title: "Where creativity meets influence - without limits.",
    content:
      "Turn your ideas into influence with tools designed for creativity, connection, and impact.",
    bg: "#B0E0E6",
  },
  {
    title: "Pins with a Purpose",
    content:
      "Beyond inspiration - make it yours. Hover over pins to explore where to buy. Instant shopping, no searching.",
    emoji: "🛍️",
    bg: "#E4F9F5",
  },
  {
    title: "Your Social Visual Space",
    content:
      "Boards made to be shared. With Girl Mode and Boy Mode themes. Save, share, and vibe your way.",
    emoji: "💕",
    bg: "#FFF0F5",
  },
  {
    title: "Ready to Pin Your World?",
    content:
      "Join PInfluence now. No credit card needed. Start building your boards today.",
    emoji: "🚀",
    bg: "#F9F7EF",
    cta: true,
  },
];

const HomePage = () => {
  return (
    <div className="snap-container">
      {sections.map((section, i) => (
        <motion.div
          key={i}
          className="snap-section"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: section.bg,
          }}
        >
          <div className="card-content">
            <h2>{section.emoji} {section.title}</h2>
            <p>{section.content}</p>
            {i === 0 && <RollingGallery autoplay pauseOnHover />}
            {section.cta && (
              <div style={{ width: "100%" }}>
                <SignUpForm />
              </div>
            )}
          </div>
        </motion.div>
      ))}
      {/* Add the footer here */}
      <Footer />
    </div>
  );
};

export default HomePage;
