"use client";

import * as React from "react";

// Dark canvas + fake cursor for scripts/record-video.mts. Headless Chrome has
// no visible mouse pointer, so the cursor is drawn here and follows the real
// mousemove events Playwright dispatches. `#video-reset` lets a scene undo
// state (e.g. a loading flag) so the clip loops back to its first frame.
export function Stage({ children, onReset }: { children: React.ReactNode; onReset?: () => void }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0, on: false });
  React.useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY, on: true });
    // Capture phase, pointer events too: components that capture the pointer while dragging (splitter,
    // sliders) can stop the move from bubbling up to the window, which froze the drawn cursor.
    window.addEventListener("mousemove", move, true);
    window.addEventListener("pointermove", move, true);
    return () => {
      window.removeEventListener("mousemove", move, true);
      window.removeEventListener("pointermove", move, true);
    };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", overflow: "clip" }}>
      {children}
      <button id="video-reset" tabIndex={-1} onClick={onReset} style={{ position: "fixed", left: 0, top: 0, opacity: 0, width: 1, height: 1, pointerEvents: "none" }} />
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        style={{ position: "fixed", zIndex: 2147483647, left: pos.x - 3, top: pos.y - 2, opacity: pos.on ? 1 : 0, pointerEvents: "none", filter: "drop-shadow(0 2px 3px rgba(0,0,0,.6))" }}
      >
        <path d="M3 2v19l5-4.6 3.4 7.3 3.2-1.5-3.3-7.1H18z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
