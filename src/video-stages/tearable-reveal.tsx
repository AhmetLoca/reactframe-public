"use client";

import { TearableReveal } from "../../registry/new-york/tearable-reveal/tearable-reveal";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function TearableRevealStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <TearableReveal
          backgroundSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
          hintText="Drag, it tears easily"
        />
      </div>
    </Stage>
  );
}
