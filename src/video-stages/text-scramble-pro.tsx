"use client";

import { TextScramblePro } from "../../registry/new-york/text-scramble-pro/text-scramble-pro";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function TextScrambleProStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <TextScramblePro />
      </div>
    </Stage>
  );
}
