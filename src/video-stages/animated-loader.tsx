"use client";

import * as React from "react";
import { AnimatedLoader } from "../../registry/new-york/animated-loader/animated-loader";
import { Stage } from "./stage";

// Each #video-reset press shows the next variant, ending back on dots (the thumbnail's variant).
const VARIANTS = ["dots", "ring", "dual-ring", "lines", "dots"] as const;

export function AnimatedLoaderStage() {
  const [step, setStep] = React.useState(0);
  return (
    <Stage onReset={() => setStep((s) => Math.min(s + 1, VARIANTS.length - 1))}>
      <div style={{ transform: "scale(1)" }}>
        <AnimatedLoader variant={VARIANTS[step]} trackColor="rgba(255,255,255,0.16)" size={56} thickness={4} />
      </div>
    </Stage>
  );
}
