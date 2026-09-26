"use client";

import * as React from "react";
import { Breadcrumb } from "../../registry/new-york/breadcrumb/breadcrumb";
import { Stage } from "./stage";

const TRAIL = ["Home", "Components", "Breadcrumb"];

// Clicking a crumb trims the trail back to it; each #video-reset press walks one level deeper again.
export function BreadcrumbStage() {
  const [depth, setDepth] = React.useState(TRAIL.length);
  const items = TRAIL.slice(0, depth).map((label, i) => (i < depth - 1 ? { label, onClick: () => setDepth(i + 1) } : { label }));
  return (
    <Stage onReset={() => setDepth((d) => Math.min(d + 1, TRAIL.length))}>
      <div style={{ transform: "scale(1.25)" }}>
        <Breadcrumb items={items} size="md" />
      </div>
    </Stage>
  );
}
