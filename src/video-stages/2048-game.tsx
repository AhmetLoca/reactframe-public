"use client";

import * as React from "react";
import { Game2048 } from "../../registry/new-york/2048-game/2048-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 360px card at 0.8x. Math.random is re-seeded right before every mount, so
// the opening board is the same each time; #video-reset also clears the saved best score, then
// fades the card out and back in on that same opening board.
export function Game2048Stage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(2048), [key]);
  return (
    <Stage
      onReset={() => {
        localStorage.removeItem("2048-best");
        reset();
      }}
    >
      <div style={{ width: 360, transform: "scale(0.8)", ...style }}>
        <Game2048 key={key} />
      </div>
    </Stage>
  );
}
