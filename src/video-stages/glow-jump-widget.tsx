"use client";

import { GlowJumpWidget } from "../../registry/new-york/glow-jump-widget/glow-jump-widget";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The game at its natural 640x480 inside the 800x600 frame. #video-reset fades it out and back in
// on a fresh level.
export function GlowJumpWidgetStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div style={{ width: 640, ...style }}>
        <GlowJumpWidget key={key} />
      </div>
    </Stage>
  );
}
