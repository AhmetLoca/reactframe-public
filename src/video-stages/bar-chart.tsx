"use client";

import { BarChart } from "../../registry/new-york/bar-chart/bar-chart";
import { Stage } from "./stage";

// The registry preview's chart card, drawn at 0.9x.
export function BarChartStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.9)" }}>
        <div style={{ width: 720 }}>
          <BarChart chartHeight={420} />
        </div>
      </div>
    </Stage>
  );
}
