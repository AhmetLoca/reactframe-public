"use client";

import * as React from "react";
import { MotionGalleryGrid } from "../../registry/new-york/motion-gallery-grid/motion-gallery-grid";
import { Stage } from "./stage";

// The registry preview (1100px wide, rounded and bordered) drawn at 0.58x so the whole grid fits.
// #video-reset remounts it, which replays the staggered entrance.
export function MotionGalleryGridStage() {
  const [key, setKey] = React.useState(0);
  return (
    <Stage onReset={() => setKey((k) => k + 1)}>
      <div style={{ transform: "scale(0.58)" }}>
        <div className="overflow-hidden" style={{ width: 1100, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <MotionGalleryGrid key={key} />
        </div>
      </div>
    </Stage>
  );
}
