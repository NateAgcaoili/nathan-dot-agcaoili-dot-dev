import React from "react";
import DesktopIcon from "../DesktopIcon/DesktopIcon";
import "./Desktop.css";

interface IconData {
  id: number;
  imageSrc: string;
  iconName: string;
}

interface DesktopProps {
  icons: IconData[];
  onIconClick: (icon: IconData) => void;
}

const Desktop: React.FC<DesktopProps> = ({ icons, onIconClick }) => {
  return (
    <div className="desktop">
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          imageSrc={icon.imageSrc}
          iconName={icon.iconName}
          onClick={() => onIconClick(icon)}
        />
      ))}
    </div>
  );
};

export default Desktop;
