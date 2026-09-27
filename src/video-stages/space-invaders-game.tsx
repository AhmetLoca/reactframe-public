"use client";

import * as React from "react";
import { SpaceInvadersGame } from "../../registry/new-york/space-invaders-game/space-invaders-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The game at 760px wide drawn at 0.84x, with seeded invader fire so every recording plays the same.
// #video-reset fades it out and back in on a fresh wave.
export function SpaceInvadersGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(6), [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 760, transform: "translateY(-40px) scale(0.84)", ...style }}>
        <SpaceInvadersGame key={key} />
      </div>
    </Stage>
  );
}
