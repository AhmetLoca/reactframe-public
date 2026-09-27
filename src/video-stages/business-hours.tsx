"use client";

import * as React from "react";
import { BusinessHours } from "../../registry/new-york/business-hours/business-hours";
import { Stage } from "./stage";

// A fixed-offset zone where it is currently mid-afternoon on a weekday or Saturday, so the card
// always records as "Open now", whatever the time of the recording.
function openZone(): string {
  const now = Date.now();
  for (let o = -12; o <= 14; o++) {
    const d = new Date(now + o * 3600_000);
    const day = d.getUTCDay();
    const hour = d.getUTCHours();
    if (day !== 0 && hour >= 10 && hour < 16) return o === 0 ? "Etc/GMT" : `Etc/GMT${o < 0 ? "+" : "-"}${Math.abs(o)}`;
  }
  return "UTC";
}

// The registry preview (1100x700, no border) drawn at 0.727x.
export function BusinessHoursStage() {
  const [zone, setZone] = React.useState<string>();
  // Picked after mount: "now" differs between the server render and hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setZone(openZone()), []);
  return (
    <Stage>
      <div style={{ transform: "scale(0.727)" }}>
        <div style={{ width: 1100, height: 700 }}>
          <BusinessHours timeZone={zone} />
        </div>
      </div>
    </Stage>
  );
}
