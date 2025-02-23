import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import "./ApplicationWindow.css";

interface ApplicationWindowProps {
  title: string;
  iconSrc: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultMaximized?: boolean;
}

const TASKBAR_HEIGHT = 42;

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  title,
  iconSrc,
  onClose,
  children,
  defaultMaximized = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [maximized, setMaximized] = useState(defaultMaximized);
  const [minimized, setMinimized] = useState(false);

  // For restored state, store size; position is now managed by Draggable's transform.
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 300,
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
    }
  }, [maximized]);

  // If dragging starts on a maximized window, restore it.
  const handleDragStart: DraggableEventHandler = () => {
    if (maximized) {
      setMaximized(false);
      // Optionally, update size/state here.
      setSize({ width: 400, height: 300 });
    }
  };

  // On drag stop, we update nothing here since Draggable
  // manages the position via transform; we don't use our own position state.
  const handleDragStop: DraggableEventHandler = (e, data) => {
    // You could store data.x, data.y here if you want to persist position,
    // but then you’d have to control the component via the `position` prop,
    // which we've seen causes snapping issues.
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
    windowStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else {
    // Restored state: do not include top/left so Draggable controls it.
    windowStyle = {
      position: "absolute",
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
      handle=".app-window-header"
      cancel=".app-window-right, button"
      defaultPosition={{ x: 100, y: 100 }}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      {windowContent}
    </Draggable>
  );
};

export default ApplicationWindow;
