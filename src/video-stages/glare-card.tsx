"use client";

import { GlareCard } from "../../registry/new-york/glare-card/glare-card";
import { Stage } from "./stage";

// The registry preview's square card at 440px.
export function GlareCardStage() {
  return (
    <Stage>
      <div style={{ width: 440, height: 440 }}>
        <GlareCard title="Glare Card" subtitle="Cursor-reactive tilt & reflections." image="/demo/21.webp" />
      </div>
    </Stage>
  );
}
