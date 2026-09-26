"use client";

import * as React from "react";
import { BackToTop } from "../../registry/new-york/back-to-top/back-to-top";
import { Stage } from "./stage";

const START_SCROLL = 30;

// A short scrollable box of skeleton lines, opened scrolled just past the (low) threshold so the button
// shows with a nearly full ring, as in the thumbnail. The scene clicks it, then wheels back down.
export function BackToTopStage() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = START_SCROLL;
  }, []);
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <div
          ref={scrollRef}
          className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ position: "relative", width: 300, height: 220, overflowY: "auto", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", background: "#080808" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px 16px" }}>
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.07)", width: i % 2 ? 235 - i : 190 - i }} />
            ))}
          </div>
          <BackToTop containerRef={scrollRef} contained showProgress threshold={10} offset={14} accentColor="#F59E0B" />
        </div>
      </div>
    </Stage>
  );
}
