"use client";

import { BubbleCursor } from "../../registry/new-york/bubble-cursor/bubble-cursor";
import { Stage } from "./stage";

// The registry preview's dark field filling the frame. The bubble trail is the cursor here, so the
// stage's drawn arrow is hidden.
export function BubbleCursorStage() {
  return (
    <Stage>
      <style>{`svg[style*="2147483647"]{display:none!important}`}</style>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <BubbleCursor showThemeToggle={false} hideOnTouch={false} />
      </div>
    </Stage>
  );
}
