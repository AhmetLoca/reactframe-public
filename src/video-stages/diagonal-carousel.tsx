"use client";

import { DiagonalCarousel } from "../../registry/new-york/diagonal-carousel/diagonal-carousel";
import { Stage } from "./stage";

// The carousel at 1100x825 drawn at 0.727x, filling the frame.
export function DiagonalCarouselStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.727)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 825 }}>
          <DiagonalCarousel cardSize={180} />
        </div>
      </div>
    </Stage>
  );
}
