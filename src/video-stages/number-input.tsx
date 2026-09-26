"use client";

import { NumberInput } from "../../registry/new-york/number-input/number-input";
import { Stage } from "./stage";

export function NumberInputStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <NumberInput defaultValue={24} size="md" width={180} />
      </div>
    </Stage>
  );
}
