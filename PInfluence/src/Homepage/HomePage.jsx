// src/Homepage/HomePage.jsx
import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Visual meets inspiration.",
    content:
      "Welcome to PInfluence - where creativity flows through a grid of stunning visuals and mood boards. Curate your world with pins that spark ideas, emotions, and style.",
    emoji: "🌀",
    bg: "#FDE2E4",
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
    <div>
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: section.bg,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "4rem 2rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", fontFamily: "cursive" }}>
            {section.emoji} {section.title}
          </h2>
          <p style={{ maxWidth: "800px", margin: "1rem 0", fontSize: "1.2rem" }}>
            {section.content}
          </p>
          {section.cta && (
            <button
              style={{
                background: "#5F9EA0",
                color: "#fff",
                padding: "1rem 2rem",
                fontSize: "1rem",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Get Started
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default HomePage;
