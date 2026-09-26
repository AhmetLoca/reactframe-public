"use client";

import * as React from "react";
import { Timeline, type TimelineItem } from "../../registry/new-york/timeline/timeline";
import { Stage } from "./stage";

// How many steps are complete; the next one is active. Each #video-reset press advances it, wrapping
// back to the thumbnail's state (two done, "Out for delivery" active).
const STEPS = [
  { id: "placed", title: "Order placed", date: "Sep 20" },
  { id: "shipped", title: "Shipped", date: "Sep 22" },
  { id: "out", title: "Out for delivery", date: "Today" },
  { id: "delivered", title: "Delivered" },
];

export function TimelineStage() {
  const [done, setDone] = React.useState(2);
  const items: TimelineItem[] = STEPS.map((s, i) => ({ ...s, status: i < done ? "done" : i === done ? "active" : "pending" }));
  return (
    <Stage onReset={() => setDone((d) => (d >= STEPS.length ? 2 : d + 1))}>
      <div style={{ transform: "scale(1.25)" }}>
        <Timeline items={items} accentColor="#F59E0B" width={300} />
      </div>
    </Stage>
  );
}
