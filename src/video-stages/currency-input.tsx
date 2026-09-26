"use client";

import { CurrencyInput } from "../../registry/new-york/currency-input/currency-input";
import { Stage } from "./stage";

export function CurrencyInputStage() {
  return (
    <Stage>
      <div id="video-camera" style={{ transform: "scale(1.25)" }}>
        <CurrencyInput defaultValue={2500} width={280} />
      </div>
    </Stage>
  );
}
