"use client";

import * as React from "react";
import { Badge, type BadgeIconType, type BadgeTone } from "../../registry/new-york/badges-kit/badges-kit";
import { Stage } from "./stage";

const STEPS: { label: string; tone: BadgeTone; icon: BadgeIconType; ms: number }[] = [
  { label: "Pending", tone: "warning", icon: "dot", ms: 800 },
  { label: "Processing", tone: "info", icon: "spinner", ms: 1100 },
  { label: "Paid", tone: "success", icon: "dot", ms: 0 },
];

export function BadgesKitStage() {
  const [step, setStep] = React.useState(-1);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  // The scene presses #video-reset to start the Pending -> Processing -> Paid run.
  const start = () => {
    timers.current.forEach(clearTimeout);
    let at = 0;
    timers.current = STEPS.map((s, i) => {
      const id = setTimeout(() => setStep(i === STEPS.length - 1 ? -1 : i), at);
      at += s.ms;
      return id;
    });
  };
  const s = step >= 0 ? STEPS[step] : STEPS[STEPS.length - 1];
  return (
    <Stage onReset={start}>
      <div style={{ transform: "translateX(-2px) scale(1.14)" }}>
        <Badge label={s.label} tone={s.tone} icon={s.icon} size="lg" theme="dark" />
      </div>
    </Stage>
  );
}
