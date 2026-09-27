"use client";

import * as React from "react";
import { SnakeGame } from "../../registry/new-york/snake-game/snake-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 360px card at 0.8x, with seeded food placement. #video-reset clears the
// saved best score and fades the card out and back in on a fresh game.
export function SnakeGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(15), [key]);
  return (
    <Stage
      onReset={() => {
        localStorage.removeItem("snake-highscore");
        reset();
      }}
    >
      <div style={{ width: 360, transform: "scale(0.8)", ...style }}>
        <SnakeGame key={key} />
      </div>
    </Stage>
  );
}
