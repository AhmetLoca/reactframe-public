"use client";

import { RangeAreaChart } from "../../registry/new-york/range-area-chart/range-area-chart";
import { Stage } from "./stage";

// The registry preview's chart card, drawn at 0.75x, as in the thumbnail.
export function RangeAreaChartStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.75)" }}>
        <div style={{ width: 709 }}>
          <RangeAreaChart chartHeight={420} />
        </div>
      </div>
    </Stage>
  );
}
