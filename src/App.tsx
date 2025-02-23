import React, { useState } from "react";
import Taskbar from "./components/Taskbar/Taskbar";
import Desktop from "./components/Desktop/Desktop";
import ApplicationWindow from "./components/ApplicationWindow/ApplicationWindow";
import "./App.css";

import linkedinIcon from "./assets/icons/linkedin.svg";
import githubIcon from "./assets/icons/github.svg";

import aboutMeIcon from "/desktop-icons/about-me-icon.png";

interface IconData {
  id: number;
  imageSrc: string;
  iconName: string;
}

const icons: IconData[] = [
  { id: 1, imageSrc: aboutMeIcon, iconName: "About Me" },
  { id: 2, imageSrc: githubIcon, iconName: "Projects" },
  { id: 3, imageSrc: linkedinIcon, iconName: "Network Neighborhood" },
];

const App: React.FC = () => {
  const [openApp, setOpenApp] = useState<IconData | null>(null);

  return (
    <div className="container">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/videos/vw_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="app-container">
        <Desktop
          icons={icons}
          onIconClick={(icon) => {
            console.log("Desktop icon clicked:", icon);
            setOpenApp(icon);
          }}
        />
      </div>
      <Taskbar />
      {openApp && (
        <ApplicationWindow
          title={openApp.iconName}
          iconSrc={openApp.imageSrc}
          onClose={() => setOpenApp(null)}
        >
          <p>{openApp.iconName} coming soon!.</p>
        </ApplicationWindow>
      )}
    </div>
  );
};

export default App;
