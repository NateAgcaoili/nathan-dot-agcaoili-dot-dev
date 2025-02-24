import React, { useState, useEffect, useRef } from "react";
import "./ApplicationWindow.css";

interface ApplicationWindowProps {
  title: string;
  iconSrc: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultMaximized?: boolean;
  resizable?: boolean;
}

const TASKBAR_HEIGHT = 42;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  title,
  iconSrc,
  onClose,
  children,
  defaultMaximized = false,
  resizable = true,
}) => {
  // Track whether we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Window states
  const [maximized, setMaximized] = useState(defaultMaximized);
  const [minimized, setMinimized] = useState(false);

  // For the restored state, store: top, left, width, height
  // This way, we can directly set inline styles with no transform.
  const [windowRect, setWindowRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: 100,
    left: 100,
    width: 400,
    height: 300,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // If maximized on desktop, fill the screen minus taskbar
  useEffect(() => {
    if (maximized && windowRef.current) {
      windowRef.current.style.top = "0px";
      windowRef.current.style.left = "0px";
      windowRef.current.style.width = "100%";
      windowRef.current.style.height = `calc(100% - ${TASKBAR_HEIGHT}px)`;
    }
  }, [maximized]);

  // Minimize / restore / maximize
  const handleMaximize = () => {
    if (minimized) setMinimized(false);
    setMaximized((prev) => !prev);
  };
  const handleMinimize = () => setMinimized(true);
  const handleRestore = () => setMinimized(false);

  // --- DRAGGING LOGIC (manual) ---
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startTop: number;
    startLeft: number;
  } | null>(null);

  const onMouseDownHeader = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If maximized, restore to the old windowRect size
    if (maximized) {
      setMaximized(false);
      // Optionally restore to some default or the last known windowRect
      // But let's keep whatever we have in windowRect
    }
    // Start dragging from the header
    setDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTop: windowRect.top,
      startLeft: windowRect.left,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !dragStartRef.current) return;
      const { startX, startY, startTop, startLeft } = dragStartRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setWindowRect((prev) => ({
        ...prev,
        top: startTop + deltaY,
        left: startLeft + deltaX,
      }));
    };

    const handleMouseUp = () => {
      if (dragging) setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // --- RESIZING LOGIC (bottom-right corner) ---
  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const onMouseDownResizer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (maximized) return;
    setResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowRect.width,
      startHeight: windowRect.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing || !resizeStartRef.current) return;
      const { startX, startY, startWidth, startHeight } =
        resizeStartRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      const newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      // Lock top-left, so we only expand from bottom-right
      setWindowRect((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    };
    const handleMouseUp = () => {
      if (resizing) setResizing(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  // Determine the inline style
  let windowStyle: React.CSSProperties = {};
  if (isMobile) {
    // Mobile: fill screen minus taskbar
    windowStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else if (maximized) {
    // Maximize: fill screen minus taskbar
    windowStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    };
  } else {
    // Restored mode: use top/left from state
    windowStyle = {
      position: "absolute",
      top: windowRect.top,
      left: windowRect.left,
      width: windowRect.width,
      height: windowRect.height,
    };
  }

  return (
    <div
      className={`app-window${maximized ? " maximized" : ""}`}
      style={windowStyle}
      ref={windowRef}
    >
      <div className="app-window-header" onMouseDown={onMouseDownHeader}>
        <div className="app-window-left">
          <img src={iconSrc} alt="icon" className="app-window-icon" />
          <span className="app-window-title">{title}</span>
        </div>
        <div className="app-window-right">
          {minimized ? (
            <button
              className="app-window-btn restore-btn"
              onClick={() => setMinimized(false)}
            />
          ) : (
            <>
              <button
                className="app-window-btn minimize-btn"
                onClick={() => setMinimized(true)}
              />
              <button
                className="app-window-btn maximize-btn"
                onClick={() => {
                  if (minimized) setMinimized(false);
                  setMaximized((prev) => !prev);
                }}
              />
            </>
          )}
          <button className="app-window-btn close-btn" onClick={onClose} />
        </div>
      </div>
      {!minimized && (
        <div className="app-window-body">
          {children}
          {resizable && !maximized && (
            <div className="app-window-footer">
              <div
                className="app-window-resizer"
                onMouseDown={onMouseDownResizer}
              >
                <div className="resizer-line line1" />
                <div className="resizer-line line2" />
                <div className="resizer-line line3" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationWindow;
