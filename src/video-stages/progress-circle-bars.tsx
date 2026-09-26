"use client";

import * as React from "react";
import { ProgressCircleBars } from "../../registry/new-york/progress-circle-bars/progress-circle-bars";
import { Stage } from "./stage";

// The scene presses #video-reset to run 75 -> 100 -> 30 -> back to 75.
const STEPS = [
  { value: 100, ms: 0 },
  { value: 30, ms: 1100 },
  { value: 75, ms: 1100 },
];

export function ProgressCircleBarsStage() {
  const [value, setValue] = React.useState(75);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const start = () => {
    timers.current.forEach(clearTimeout);
    let at = 0;
    timers.current = STEPS.map((s) => {
      at += s.ms;
      return setTimeout(() => setValue(s.value), at);
    });
  };
  return (
    <Stage onReset={start}>
      <div style={{ transform: "translateX(-2px) scale(0.75)" }}>
        <ProgressCircleBars label="Circle" percentage={value} labelColor="#ffffff" percentageColor="#ffffff" sizePreset="2xl" />
      </div>
    </Stage>
  );
}
