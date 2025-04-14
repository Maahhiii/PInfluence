import React from "react";
import { motion } from "framer-motion";
import RollingGallery from "./RollingGallery";
import SignUpForm from "./SignUp"; // ensure this uses forwardRef
import Footer from "./Footer";
import "./HomePage.css";
import FlowingMenu from './FlowingMenu';

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
    bg: "#cef3a4",
  },
  {
    title: "Your Social Visual Space",
    content:
      "Boards made to be shared. With Girl Mode and Boy Mode themes. Save, share, and vibe your way.",
    emoji: "💕",
    bg: "#facada",
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

const HomePage = ({ signUpRef, scrollToSignUp }) => {
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
            minHeight: "100vh", // Fix white space issue
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          <div className="card-content" style={{ maxWidth: "800px" }}>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
              {section.emoji && `${section.emoji} `}{section.title}
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
              {section.content}
            </p>

            {i === 0 && <RollingGallery autoplay pauseOnHover />}

            {section.cta && (
              <div>
                <SignUpForm ref={signUpRef} />
                <button
                  onClick={scrollToSignUp}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    backgroundColor: "#AFA8F0",
                    color: "#fff",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Scroll to Sign Up
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Footer at the end */}
      <Footer />
    </div>
  );
};

export default HomePage;
