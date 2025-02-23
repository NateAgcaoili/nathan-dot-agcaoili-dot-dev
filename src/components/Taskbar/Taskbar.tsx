import React, { useState, useEffect, useRef } from "react";
import "./Taskbar.css";

const Taskbar: React.FC = () => {
  const [time, setTime] = useState("");
  // Use ReturnType<typeof setInterval> to avoid NodeJS types
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Function to format the time as hh:mm AM/PM
  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    setTime(`${hours}:${minutesStr} ${ampm}`);
  };

  useEffect(() => {
    // 1) Update the time immediately
    updateTime();

    // 2) Calculate ms until the next minute boundary
    const now = new Date();
    const msUntilNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    // 3) Set a timeout to fire at the next minute boundary
    const timeoutId = setTimeout(() => {
      // a) Update time exactly on the new minute
      updateTime();

      // b) Start an interval that fires every 60 seconds
      intervalIdRef.current = setInterval(() => {
        updateTime();
      }, 60000);
    }, msUntilNextMinute);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div className="taskbar">
      <button className="start-button">Start</button>
      <div className="taskbar-spacer" />
      <div className="taskbar-clock">{time}</div>
    </div>
  );
};

export default Taskbar;
