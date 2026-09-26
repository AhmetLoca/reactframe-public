"use client";

import { TogglePro } from "../../registry/new-york/toggle-pro/toggle-pro";
import { Stage } from "./stage";

export function ToggleProStage() {
  return (
    <Stage>
      <TogglePro defaultChecked trackOnColor="#F59E0B" trackOffColor="rgba(255,255,255,0.16)" thumbColor="#ffffff" width={76} height={44} padding={5.5} />
    </Stage>
  );
}
