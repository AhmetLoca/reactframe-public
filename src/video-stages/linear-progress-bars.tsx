"use client";

import * as React from "react";
import { LinearProgressBars } from "../../registry/new-york/linear-progress-bars/linear-progress-bars";
import { Stage } from "./stage";

// The scene presses #video-reset to run 80 -> 100 -> 20 -> back to 80.
const STEPS = [
  { value: 100, ms: 0 },
  { value: 20, ms: 1500 },
  { value: 80, ms: 1500 },
];

export function LinearProgressBarsStage() {
  const [pct, setPct] = React.useState(80);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const start = () => {
    timers.current.forEach(clearTimeout);
    let at = 0;
    timers.current = STEPS.map((s) => {
      at += s.ms;
      return setTimeout(() => setPct(s.value), at);
    });
  };
  return (
    <Stage onReset={start}>
      <div style={{ width: 520, transform: "translate(1.5px, -4.5px) scale(0.545)" }}>
        <LinearProgressBars
          scrollReveal={false}
          animationDuration={0.6}
          cardBg="transparent"
          cardShadow="none"
          cardPaddingX={0}
          cardPaddingY={0}
          theme="dark"
          rows={[{ kind: "bar", label: "brand-assets.zip", labelRight: `${pct}%`, pct, colorStart: "#f59e0b", colorEnd: "#ef4444", height: 10, capStyle: "glow" }]}
        />
      </div>
    </Stage>
  );
}
