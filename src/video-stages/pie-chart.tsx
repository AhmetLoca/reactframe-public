"use client";

import { PieChart } from "../../registry/new-york/pie-chart/pie-chart";
import { Stage } from "./stage";

// The registry preview's chart card, drawn at 0.72x, as in the thumbnail.
export function PieChartStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.72)" }}>
        <div style={{ width: 720 }}>
          <PieChart chartHeight={560} outerRadius={200} />
        </div>
      </div>
    </Stage>
  );
}
