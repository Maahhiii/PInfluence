// src/Homepage/HomePage.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import RollingGallery from "./RollingGallery";
import SignUpForm from "./SignUp";
import Footer from "./Footer";
import "./HomePage.css";
import RotatingText from './RotatingText';
import SplitText from "./SplitText";
import Carousel from './Carousel';

const sections = [
  {
    title: "Where creativity meets influence - without limits.",
    content: "Turn your ideas into influence with tools designed for creativity, connection, and impact.",
    bg: "#B0E0E6",
  },
  {
    title: "Pins with a Purpose",
    content: "Beyond inspiration - make it yours. Hover over pins to explore where to buy. Instant shopping, no searching.",
    emoji: "🛍️",
    bg: "#cef3a4",
  },
  {
    title: "Your Social Visual Space",
    content: "Boards made to be shared. With Girl Mode and Boy Mode themes. Save, share, and vibe your way.",
    emoji: "💕",
    bg: "#facada",
  },
  {
    title: "Ready to Pin Your World?",
    content: "Join PInfluence now. No credit card needed. Start building your boards today.",
    emoji: "🚀",
    bg: "#F9F7EF",
    cta: true,
  },
];

const HomePage = () => {
  const signUpRef = useRef(null);

  const scrollToSignUp = () => {
    if (signUpRef.current) {
      signUpRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
            {i === 0 ? (
              <>
                <RotatingText
                  texts={["Creative boards.", "Creative vibes.", "Creative influence."]}
                  staggerDuration={0.03}
                  rotationInterval={2500}
                  splitBy="characters"
                />
                <p>{section.content}</p>
                <RollingGallery autoplay pauseOnHover />
              </>
            ) : i === 1 ? (
              <>
                <SplitText
                  text="Pins with a Purpose"
                  className="text-5xl text-black text-center mb-4"
                  delay={60}
                  animationFrom={{ opacity: 0, transform: 'translateY(40px)' }}
                  animationTo={{ opacity: 1, transform: 'translateY(0)' }}
                  fontFamily="'Poppins', sans-serif"
                  fontWeight={900}
                />
                <p>{section.content}</p>
                <Carousel />
              </>
            ) : i === 2 ? (
              <>
                <img
                  src="img1.png"
                  alt="Your Social Visual Space"
                  className="social-space-image"
                  style={{
                    width: "70%",
                    maxWidth: "800px",
                    borderRadius: "20px",
                    marginBottom: "1rem"
                  }}
                />
                <p>{section.content}</p>
              </>
            ) : (
              <>
                <h2>{section.emoji} {section.title}</h2>
                <p>{section.content}</p>
              </>
            )}
            {section.cta && (
              <div style={{ width: "100%" }} ref={signUpRef}>
                <SignUpForm />
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <Footer scrollToSignUp={scrollToSignUp} />
    </div>
  );
};

export default HomePage;
