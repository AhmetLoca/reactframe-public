"use client";

import { Kbd } from "../../registry/new-york/kbd/kbd";
import { Stage } from "./stage";

// `listen` lights each key up while it's physically held, so the scene drives it with real key presses.
export function KbdStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Kbd combo="cmd+shift+k" size="lg" listen />
      </div>
    </Stage>
  );
}
