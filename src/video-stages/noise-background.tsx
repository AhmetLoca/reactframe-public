"use client";

import { NoiseBackground } from "../../registry/new-york/noise-background/noise-background";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function NoiseBackgroundStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <NoiseBackground animateBlobs />
      </div>
    </Stage>
  );
}
