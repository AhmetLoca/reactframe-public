"use client";

import { AiImageLoader03 } from "../../registry/new-york/ai-image-loader-03/ai-image-loader-03";
import { Stage } from "./stage";

// The thumbnail shows the card at 0.57x of the preview's 420px height. Short timings so the clip
// shows a full generate → reveal → restart loop.
export function AiImageLoader03Stage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.57)" }}>
        <div style={{ height: 420, aspectRatio: "3 / 4" }}>
          <AiImageLoader03 loop generateSeconds={6} loopDelay={2} />
        </div>
      </div>
    </Stage>
  );
}
