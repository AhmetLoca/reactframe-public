"use client";

import { CosmicBackground } from "../../registry/new-york/cosmic-background/cosmic-background";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function CosmicBackgroundStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <CosmicBackground />
      </div>
    </Stage>
  );
}
