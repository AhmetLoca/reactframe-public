"use client";

import * as React from "react";
import { MemoryMatchGame } from "../../registry/new-york/memory-match-game/memory-match-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 420px card at 0.74x, with a seeded shuffle so every recording deals the
// same cards. #video-reset fades it out and back in on a fresh deal.
export function MemoryMatchGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(4), [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 420, transform: "scale(0.74)", ...style }}>
        <MemoryMatchGame key={key} />
      </div>
    </Stage>
  );
}
