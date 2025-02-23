import React, { useState } from "react";
import "./DesktopIcon.css";

interface DesktopIconProps {
  imageSrc: string;
  iconName: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  imageSrc,
  iconName,
  onClick,
}) => {
  const [animating, setAnimating] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    if (animating) return; // Prevent overlapping animations
    setAnimating(true);
    // Flash sequence: blue on → off → blue on → off
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    setTimeout(() => setFlash(true), 200);
    setTimeout(() => setFlash(false), 300);
    setTimeout(() => {
      setAnimating(false);
      onClick();
    }, 350);
  };

  return (
    <div
      className={`desktop-icon ${flash ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="icon-wrapper">
        <img src={imageSrc} alt={iconName} className="icon-image" />
      </div>
      <div className="icon-name">{iconName}</div>
    </div>
  );
};

export default DesktopIcon;
