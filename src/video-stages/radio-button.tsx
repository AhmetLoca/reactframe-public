"use client";

import { RadioButton } from "../../registry/new-york/radio-button/radio-button";
import { Stage } from "./stage";

const OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

export function RadioButtonStage() {
  return (
    <Stage>
      <RadioButton
        options={OPTIONS}
        defaultValue="yearly"
        size={25}
        accentColor="#F59E0B"
        dotColor="#F59E0B"
        labelColor="#ffffff"
        helperColor="rgba(255,255,255,0.55)"
        borderColor="rgba(255,255,255,0.35)"
      />
    </Stage>
  );
}
