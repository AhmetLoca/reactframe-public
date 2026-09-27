"use client";

import { TiltText } from "../../registry/new-york/tilt-text/tilt-text";
import { Stage } from "./stage";

// The component filling the 4:3 frame at natural size.
export function TiltTextStage() {
  return (
    <Stage>
      <div className="relative overflow-hidden" style={{ width: 800, height: 600 }}>
        <TiltText fontSize={80} />
      </div>
    </Stage>
  );
}
