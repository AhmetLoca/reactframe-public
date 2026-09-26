"use client";

import * as React from "react";
import { StatCard } from "../../registry/new-york/stat-card/stat-card";
import { Stage } from "./stage";

const SPARK = [32, 36, 34, 40, 39, 38, 44, 43, 50, 47, 55];

// #video-reset remounts the card so the count-up and the sparkline draw-in play again.
export function StatCardStage() {
  const [run, setRun] = React.useState(0);
  return (
    <Stage onReset={() => setRun((r) => r + 1)}>
      <div style={{ transform: "scale(1.25)" }}>
        <StatCard key={run} label="Revenue" value={48250} prefix="$" delta={12} sparkline={SPARK} sparklineStyle="smooth" accentColor="#F59E0B" width={280} />
      </div>
    </Stage>
  );
}
