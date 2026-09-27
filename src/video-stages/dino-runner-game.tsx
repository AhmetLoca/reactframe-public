"use client";

import * as React from "react";
import { DinoRunnerGame } from "../../registry/new-york/dino-runner-game/dino-runner-game";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The game at 720px wide drawn at 0.68x, with seeded obstacle spawns so every recording runs the same course.
// #video-reset clears the saved best and fades it out and back in fresh.
export function DinoRunnerGameStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => seedRandom(5), [key]);
  return (
    <Stage
      onReset={() => {
        Object.keys(localStorage)
          .filter((k) => k.toLowerCase().includes("dino"))
          .forEach((k) => localStorage.removeItem(k));
        reset();
      }}
    >
      <div style={{ width: 720, transform: "scale(0.68)", ...style }}>
        <DinoRunnerGame key={key} />
      </div>
    </Stage>
  );
}
