"use client";

import { Stepper } from "../../registry/new-york/stepper/stepper";
import { Stage } from "./stage";

const STEPS = [{ label: "Cart" }, { label: "Shipping" }, { label: "Payment" }];

export function StepperStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)", width: 360 }}>
        <Stepper steps={STEPS} defaultStep={1} size="md" accentColor="#F59E0B" clickable />
      </div>
    </Stage>
  );
}
