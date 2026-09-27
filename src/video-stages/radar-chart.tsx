"use client";

import { RadarChart } from "../../registry/new-york/radar-chart/radar-chart";
import { Stage } from "./stage";

// The registry preview's chart card, drawn at 0.62x, as in the thumbnail.
export function RadarChartStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.62)" }}>
        <div style={{ width: 680 }}>
          <RadarChart chartHeight={420} outerRadius={190} />
        </div>
      </div>
    </Stage>
  );
}
