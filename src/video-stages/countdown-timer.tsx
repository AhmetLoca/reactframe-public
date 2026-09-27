"use client";

import * as React from "react";
import { CountdownTimer } from "../../registry/new-york/countdown-timer/countdown-timer";
import { Stage } from "./stage";

// The registry preview: a week from now, counting down.
export function CountdownTimerStage() {
  const [endDate] = React.useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
  return (
    <Stage>
      <CountdownTimer endDate={endDate} />
    </Stage>
  );
}
