"use client";

import * as React from "react";
import { MinesweeperGame } from "../../registry/new-york/minesweeper-game/minesweeper-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 420px beginner board at 0.74x, with seeded mine placement so every
// recording plays the same board. #video-reset fades it out and back in fresh.
export function MinesweeperGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(9), [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 420, transform: "scale(0.74)", ...style }}>
        <MinesweeperGame key={key} />
      </div>
    </Stage>
  );
}
