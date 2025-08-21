import { useState, useEffect } from 'react';
import './BouncingIconBackground.css'; // Import the CSS

// Import icons from react-icons
// Choose icons from different libraries (fa, md, si, io, etc.)
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiRedux, SiMongodb, SiPostgresql } from 'react-icons/si';

// Array of icon components to choose from
const ICON_SET = [
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaDocker,
  SiTypescript, SiRedux, SiMongodb, SiPostgresql
];

// --- Configuration ---
const NUM_ICONS = 25; // How many icons to render
const MIN_DURATION = 15; // Minimum animation duration (seconds)
const MAX_DURATION = 30; // Maximum animation duration (seconds)
const MIN_SIZE = 20; // Minimum icon size (pixels)
const MAX_SIZE = 50; // Maximum icon size (pixels)
// --- End Configuration ---

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

const FloatingIconsBackground = () => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const generatedIcons = [];
    for (let i = 0; i < NUM_ICONS; i++) {
      const IconComponent = ICON_SET[Math.floor(Math.random() * ICON_SET.length)];
      generatedIcons.push({
        id: i,
        IconComponent: IconComponent,
        style: {
          top: `${getRandomValue(0, 95)}vh`, // Use vh/vw for responsiveness
          left: `${getRandomValue(0, 95)}vw`,
          fontSize: `${getRandomValue(MIN_SIZE, MAX_SIZE)}px`,
          animationDuration: `${getRandomValue(MIN_DURATION, MAX_DURATION)}s`,
          animationDelay: `${getRandomValue(0, MIN_DURATION)}s`, // Start animations at different times
          opacity: getRandomValue(0.2, 0.7), // Give some icons more/less prominence
        },
      });
    }
    setIcons(generatedIcons);

    // No cleanup needed as animations are CSS-based
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="background-container" aria-hidden="true">
      {icons.map(({ id, IconComponent, style }) => (
        <span key={id} className="floating-icon" style={style}>
          <IconComponent />
        </span>
      ))}
    </div>
  );
};

export default FloatingIconsBackground;