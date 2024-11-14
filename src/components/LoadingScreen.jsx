import React, { useState } from "react";
import Home from "./Home";
import styles from "../assets/css/loadingScreen.module.css";
import title from "../assets/svg/loadingScreen.gif";
import unclicked from "../assets/img/2.gif";
import clicked from "../assets/img/3.gif";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true); // Controls visibility of loading screen
  const [buttonGif, setButtonGif] = useState(unclicked); // Track which GIF to display

  const handleStart = () => {
    const audio = document.getElementById("background-audio");
    audio.volume = 0.2; // Set volume to 20% of the maximum
    audio.play().catch((error) => {
      console.log("Autoplay failed:", error);
    }); // Play audio when button is clicked

    // Start fading out the loading screen
    setIsLoading(false); // Hide loading screen and show main content
  };

  const handleMouseEnter = () => {
    setButtonGif(clicked); // Switch to the "clicked" GIF on hover
  };

  const handleMouseLeave = () => {
    setButtonGif(unclicked); // Switch back to the "unclicked" GIF when no longer hovering
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingScreenMain}>
          <div className={styles.loadingScreen}>
            <motion.div
              className="box"
              initial={{ opacity: 0, scale: 0.5 }} // Initial scale and opacity
              animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and normal scale
              transition={{ duration: 1 }} // Duration of the animation
            />
            <img src={title} alt="Loading" />
            <button
              className={styles.buttonStart}
              onClick={handleStart}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={buttonGif} alt="" />
            </button>
          </div>
        </div>
      ) : (
        // Use Framer Motion to animate the Home component transition
        <motion.div
          className={styles.mainContent}
          initial={{ opacity: 0 }} // Start invisible
          animate={{ opacity: 1 }} // Fade in the Home component
          transition={{ duration: 1 }} // 1 second fade-in
        >
          <Home />
        </motion.div>
      )}

      <audio id="background-audio" loop style={{ display: "none" }}>
        <source src="../../boba.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
