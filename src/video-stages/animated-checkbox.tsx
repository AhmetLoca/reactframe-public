"use client";

import { AnimatedCheckbox } from "../../registry/new-york/animated-checkbox/animated-checkbox";
import { Stage } from "./stage";

export function AnimatedCheckboxStage() {
  return (
    <Stage>
      <AnimatedCheckbox
        labelColor="#ffffff"
        helperColor="rgba(255,255,255,0.55)"
        mutedColor="rgba(255,255,255,0.45)"
        borderColor="rgba(255,255,255,0.35)"
        size={56}
        radius={17}
        borderWidth={3}
        ringWidth={6}
        defaultChecked
        label=""
      />
    </Stage>
  );
}
