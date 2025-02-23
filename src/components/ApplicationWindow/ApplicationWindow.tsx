import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import "./ApplicationWindow.css";

interface ApplicationWindowProps {
  title: string;
  iconSrc: string;
  onClose: () => void;
  children: React.ReactNode;
}

const TASKBAR_HEIGHT = 42; // Height of your taskbar

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  title,
  iconSrc,
  onClose,
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [maximized, setMaximized] = useState(true); // Start maximized
  const [minimized, setMinimized] = useState(false);

  // Position for the window when NOT maximized
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });
  // Default size when not maximized (you can adjust these)
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 300,
  });

  // We'll store a ref to the outer div if needed
  const windowRef = useRef<HTMLDivElement>(null);

  // Detect if we are on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If user tries to drag the header while maximized, unmaximize
  const handleDragStart: DraggableEventHandler = () => {
    if (maximized) {
      // Unmaximize
      setMaximized(false);
      setPosition({ x: 100, y: 100 }); // Move to a default position
      setSize({ width: 400, height: 300 }); // Default restored size
    }
  };

  // After dragging stops, record the new position
  const handleDragStop: DraggableEventHandler = (e, data) => {
    if (!maximized) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  const handleMaximize = () => {
    // If we're minimized, restore first
    if (minimized) setMinimized(false);
    // Toggle the maximized state
    setMaximized(!maximized);
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleRestore = () => {
    setMinimized(false);
  };

  // Decide the inline style for the window
  let windowStyle: React.CSSProperties = {};

  if (isMobile) {
    // On mobile, we fill the screen
    windowStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    };
  } else if (maximized) {
    // On desktop, if maximized, fill the desktop except for the taskbar
    windowStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else {
    // Restored state (draggable)
    windowStyle = {
      position: "absolute",
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    };
  }

  return (
    <Draggable
      // Only allow dragging from the left side of the header
      handle=".app-window-left"
      // Exclude the right side + buttons from drag
      cancel=".app-window-right, button"
      // Only apply dragging if not maximized or mobile
      disabled={isMobile || maximized}
      onStart={handleDragStart}
      onStop={handleDragStop}
      // We do not use position here; we rely on the inline style
      // because we set position: absolute in windowStyle
      // So Draggable modifies transform, but we "unmaximize" on dragStart
    >
      <div className={`app-window`} ref={windowRef} style={windowStyle}>
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
    </Draggable>
  );
};

export default ApplicationWindow;
