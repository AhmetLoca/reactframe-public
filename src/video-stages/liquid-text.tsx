"use client";

import { LiquidText } from "../../registry/new-york/liquid-text/liquid-text";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function LiquidTextStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <LiquidText />
      </div>
    </Stage>
  );
}
