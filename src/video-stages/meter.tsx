"use client";

import * as React from "react";
import { Meter } from "../../registry/new-york/meter/meter";
import { Stage } from "./stage";

// Each #video-reset press moves the gauge to the next reading, ending back on the thumbnail's 68%.
const STEPS = [68, 95, 20, 68];

export function MeterStage() {
  const [step, setStep] = React.useState(0);
  return (
    <Stage onReset={() => setStep((i) => Math.min(i + 1, STEPS.length - 1))}>
      <div style={{ transform: "translateY(4px) scale(1.04)" }}>
        <Meter variant="gauge" value={STEPS[step]} label="Storage" unit="%" size="lg" />
      </div>
    </Stage>
  );
}
