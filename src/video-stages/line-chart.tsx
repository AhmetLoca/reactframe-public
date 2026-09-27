"use client";

import { LineChart } from "../../registry/new-york/line-chart/line-chart";
import { Stage } from "./stage";

// The registry preview's chart card, drawn at 0.75x, as in the thumbnail.
export function LineChartStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.75)" }}>
        <div style={{ width: 720 }}>
          <LineChart chartHeight={420} />
        </div>
      </div>
    </Stage>
  );
}
