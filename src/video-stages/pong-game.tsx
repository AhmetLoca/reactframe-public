"use client";

import * as React from "react";
import { PongGame } from "../../registry/new-york/pong-game/pong-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 420px card at 0.88x, with a seeded serve so every recording plays the same
// rally. #video-reset fades it out and back in fresh.
export function PongGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(3), [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 420, transform: "scale(0.88)", ...style }}>
        <PongGame key={key} />
      </div>
    </Stage>
  );
}
