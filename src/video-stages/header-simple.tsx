"use client";

import { HeaderSimple } from "../../registry/new-york/header-simple/header-simple";
import { Stage } from "./stage";

// The registry preview laid out at 1000px (the desktop layout starts at 900) and shown at 0.8x.
export function HeaderSimpleStage() {
  return (
    <Stage>
      <div style={{ width: 1000, height: 750, flexShrink: 0, transform: "scale(0.8)" }} className="overflow-hidden px-6 pt-8">
        <HeaderSimple />
      </div>
    </Stage>
  );
}
