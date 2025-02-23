import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import "./ApplicationWindow.css";

interface ApplicationWindowProps {
  title: string;
  iconSrc: string;
  onClose: () => void;
  children: React.ReactNode;
  // Flag to determine if this app should open full screen on desktop.
  // For now, we'll default it to false.
  defaultMaximized?: boolean;
}

const TASKBAR_HEIGHT = 42; // Adjust this if your taskbar is a different height

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  title,
  iconSrc,
  onClose,
  children,
  defaultMaximized = false, // default is not full screen on desktop
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [maximized, setMaximized] = useState(defaultMaximized);
  const [minimized, setMinimized] = useState(false);

  // For restored state, store position and size:
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 800,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // When maximized on desktop, force the window to fill available space
  useEffect(() => {
    if (maximized && windowRef.current) {
      windowRef.current.style.transform = "none";
      windowRef.current.style.top = "0";
      windowRef.current.style.left = "0";
    }
  }, [maximized]);

  // When the user starts dragging the header, if maximized then restore
  const handleDragStart: DraggableEventHandler = () => {
    if (maximized) {
      setMaximized(false);
      // Restore to a default restored size/position.
      setPosition({ x: 100, y: 100 });
      setSize({ width: 400, height: 300 });
    }
  };

  const handleDragStop: DraggableEventHandler = (e, data) => {
    e;
    if (!maximized) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  const handleMaximize = () => {
    if (minimized) setMinimized(false);
    setMaximized((prev) => !prev);
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleRestore = () => {
    setMinimized(false);
  };

  // Decide window styles based on state:
  let windowStyle: React.CSSProperties = {};

  if (isMobile) {
    windowStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else if (maximized) {
    // Maximized: fill desktop except for taskbar
    windowStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else {
    // Restored state
    windowStyle = {
      position: "absolute",
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    };
  }

  const windowContent = (
    <div
      className={`app-window ${maximized ? "maximized" : ""}`}
      ref={windowRef}
      style={windowStyle}
    >
      <div className="app-window-header">
        <div className="app-window-left">
          <img src={iconSrc} alt="icon" className="app-window-icon" />
          <span className="app-window-title">{title}</span>
        </div>
        <div className="app-window-right">
          {minimized ? (
            <button
              className="app-window-btn restore-btn"
              onClick={handleRestore}
            />
          ) : (
            <>
              <button
                className="app-window-btn minimize-btn"
                onClick={handleMinimize}
              />
              <button
                className="app-window-btn maximize-btn"
                onClick={handleMaximize}
              />
            </>
          )}
          <button className="app-window-btn close-btn" onClick={onClose} />
        </div>
      </div>
      {!minimized && <div className="app-window-body">{children}</div>}
    </div>
  );

  if (isMobile) {
    return <div className="app-window-mobile">{windowContent}</div>;
  }

  return (
    <Draggable
      handle=".app-window-left" /* Only the left part of header is draggable */
      cancel=".app-window-right, button" /* Exclude buttons from dragging */
      defaultPosition={{ x: 100, y: 100 }}
      position={maximized ? undefined : position}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      {windowContent}
    </Draggable>
  );
};

export default ApplicationWindow;
