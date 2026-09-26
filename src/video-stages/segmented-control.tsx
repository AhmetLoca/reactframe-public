"use client";

import { SegmentedControl } from "../../registry/new-york/segmented-control/segmented-control";
import { Stage } from "./stage";

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function SegmentedControlStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <SegmentedControl options={OPTIONS} defaultValue="week" size="md" />
      </div>
    </Stage>
  );
}
