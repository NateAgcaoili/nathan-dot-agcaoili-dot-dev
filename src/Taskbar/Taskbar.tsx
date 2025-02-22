import React from "react";
import "./Taskbar.css";

const Taskbar: React.FC = () => {
  return (
    <div className="taskbar">
      <button className="start-button">Start</button>
      <div className="taskbar-spacer" />
      <div className="taskbar-clock">12:34 PM</div>
    </div>
  );
};

export default Taskbar;
