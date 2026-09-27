"use client";

import { GlowCard } from "../../registry/new-york/glow-card/glow-card";
import { Stage } from "./stage";

// The registry preview's 288x300 card at natural size.
export function GlowCardStage() {
  return (
    <Stage>
      <div style={{ width: 288, height: 300, transform: "scale(1)" }}>
        <GlowCard backgroundImage="/demo/22.webp" text="Amelia Hartwell" />
      </div>
    </Stage>
  );
}
