import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./RotatingText.css";

const words = ["influence.", "vibes.", "boards."];

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="rotating-text-wrapper">
      <h1 className="rotating-text-label">Creative</h1>
      <div className="rotating-text-box">
        <AnimatePresence mode="wait">
          <motion.div
            key={words[index]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="rotating-text-word"
          >
            {words[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
