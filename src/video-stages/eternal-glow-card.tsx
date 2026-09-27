"use client";

import { EternalGlowCard } from "../../registry/new-york/eternal-glow-card/eternal-glow-card";
import { Stage } from "./stage";

// The registry preview's 288x400 card at 0.83x.
export function EternalGlowCardStage() {
  return (
    <Stage>
      <div style={{ width: 288, height: 400, transform: "scale(0.83)" }}>
        <EternalGlowCard />
      </div>
    </Stage>
  );
}
