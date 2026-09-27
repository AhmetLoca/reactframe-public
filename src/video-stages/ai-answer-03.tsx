"use client";

import { AiAnswer03 } from "../../registry/new-york/ai-answer-03/ai-answer-03";
import { Stage } from "./stage";

// The thumbnail shows a wide card at 0.55x natural size. The answer streams on a loop with short
// timings, so the clip shows thinking, streaming and the finished answer.
export function AiAnswer03Stage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.55)" }}>
        <div style={{ width: 731, height: 491 }}>
          <AiAnswer03 stepSeconds={0.45} wordsPerSecond={36} loopDelay={1.6} />
        </div>
      </div>
    </Stage>
  );
}
