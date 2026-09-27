"use client";

import { WordReveal } from "../../registry/new-york/word-reveal/word-reveal";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The words reveal once in view (blur-in, as in the preview). #video-reset fades the block out and
// remounts it, so the reveal plays again and the clip ends on the same finished paragraph.
export function WordRevealStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div className="relative flex items-center justify-center overflow-hidden" style={{ width: 800, height: 600, transform: "scale(0.8)", ...style }}>
        <WordReveal key={key} triggerMode="inview" animPreset="blur-in" />
      </div>
    </Stage>
  );
}
