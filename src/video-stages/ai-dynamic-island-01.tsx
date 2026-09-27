"use client";

import { AIDynamicIsland01 } from "../../registry/new-york/ai-dynamic-island-01/ai-dynamic-island-01";
import { Stage } from "./stage";

// The thumbnail shows the island at 0.61x its natural width. Its own flow runs on a loop with short
// stage timings, so the clip passes through every state.
export function AiDynamicIsland01Stage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.61)" }}>
        <div style={{ width: 380, height: 420 }}>
          <AIDynamicIsland01 align="center" loop stageSeconds={1.1} stepSeconds={0.7} />
        </div>
      </div>
    </Stage>
  );
}
