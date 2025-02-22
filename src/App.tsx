import React, { useState, useEffect } from "react";
import "./App.css";

// Importing Social Media Icons
import linkedinIcon from "./assets/icons/github.svg"; // Replace with actual LinkedIn icon
import githubIcon from "./assets/icons/linkedin.svg"; // Replace with actual GitHub icon

const messages = [
  "hi...",
  "this page is currently under construction",
  "but for now, here are my socials",
];

const App: React.FC = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      if (charIndex < messages[currentMessageIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayedText(
            (prev) => prev + messages[currentMessageIndex][charIndex]
          );
          setCharIndex(charIndex + 1);
        }, 80); // **20% Faster Typing Speed**
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          setCurrentMessageIndex(currentMessageIndex + 1);
          setCharIndex(0);
          setDisplayedText((prev) => prev + "\n"); // Add line break
        }, 800); // **Shortened Delay Before Next Line**
      }
    } else {
      setTimeout(() => setShowIcons(true), 400); // **Icons Appear Faster**
    }
  }, [charIndex, currentMessageIndex]);

  return (
    <div className="container">
      {/* Background Video */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/videos/vw_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <pre className="typing-effect">{displayedText}</pre>{" "}
      {/* Ensures line breaks */}
      {/* Social Media Icons (Appear after Typing Effect with Fade-In) */}
      <div className={`social-links ${showIcons ? "fade-in" : ""}`}>
        <a
          href="https://www.linkedin.com/in/YOUR-LINKEDIN"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
        </a>
        <a
          href="https://github.com/YOUR-GITHUB"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" className="social-icon" />
        </a>
      </div>
    </div>
  );
};

export default App;
