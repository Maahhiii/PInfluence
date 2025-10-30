import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimation, useTransform } from "framer-motion";
import "./RollingGallery.css";

const IMGS = [
  "https://www.instyle.com/thmb/dJ2LDrRWhhm_qKtWLk8eOwGvrCA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/DarkAcademia-5ee2e5eaed734d0a97f5cc7228c6ca39.jpg",
  "https://media.glamour.com/photos/67f6a09017aab5885b5fe8fe/master/w_2560%2Cc_limit/1979365312",
  "https://www.fashionbeans.com/wp-content/uploads/2024/04/lucafaloni_manwithsunglasseswearinganavyblazerandjeans.jpg",
  "https://www.cho.co.uk/blog/wp-content/uploads/2023/09/Homepage-Banner-1-scaled.jpg",
  "https://miro.medium.com/v2/resize:fit:1400/1*h18k4_vwHZ-slh1CznXOZw.jpeg",
  "https://i.pinimg.com/736x/1e/3c/a1/1e3ca1205a60d1b366bd10e0d061ea1e.jpg",
  "https://i.pinimg.com/474x/b1/87/54/b1875438ef31bb348188a127cac6f841.jpg",
  "https://i.pinimg.com/736x/b5/12/6e/b5126efc5cc9805077255a1db30110b1.jpg",
  "https://i.pinimg.com/736x/9e/f0/98/9ef098ef4b2b4a021dd36bd0fedbcba7.jpg",
  "https://i.pinimg.com/736x/2a/10/f7/2a10f770ed6e7c782100206d899ec220.jpg",
];

const RollingGallery = ({ autoplay = false, pauseOnHover = false, images = [] }) => {
  images = IMGS;
  const [isScreenSizeSm, setIsScreenSizeSm] = useState(window.innerWidth <= 640);

  const cylinderWidth = isScreenSizeSm ? 1500 : 2400; // Increased cylinder width
  const faceCount = images.length;
  const faceWidth = cylinderWidth / (faceCount * 1.2); // Adjusted face width to create gaps
  const dragFactor = 0.05;
  const radius = cylinderWidth / (2 * Math.PI);

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const autoplayRef = useRef();

  const handleDrag = (_, info) => {
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: "spring", stiffness: 60, damping: 20, mass: 0.1, ease: "easeOut" },
    });
  };

  const transform = useTransform(rotation, (value) => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });

  // Autoplay effect with adjusted timing
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        controls.start({
          rotateY: rotation.get() - (360 / faceCount),
          transition: { duration: 2, ease: "linear" },
        });
        rotation.set(rotation.get() - (360 / faceCount));
      }, 2000);

      return () => clearInterval(autoplayRef.current);
    }
  }, [autoplay, rotation, controls, faceCount]);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSizeSm(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pause on hover with smooth transition
  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      clearInterval(autoplayRef.current);
      controls.stop(); // Stop the animation smoothly
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      controls.start({
        rotateY: rotation.get() - (360 / faceCount),
        transition: { duration: 2, ease: "linear" },
      });
      rotation.set(rotation.get() - (360 / faceCount));

      autoplayRef.current = setInterval(() => {
        controls.start({
          rotateY: rotation.get() - (360 / faceCount),
          transition: { duration: 2, ease: "linear" },
        });
        rotation.set(rotation.get() - (360 / faceCount));
      }, 2000);
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <motion.div
          drag="x"
          className="gallery-track"
          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              }}
            >
              <img src={url} alt="gallery" className="gallery-img" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
