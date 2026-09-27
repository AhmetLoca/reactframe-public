"use client";

import { CompareSlider } from "../../registry/new-york/compare-slider/compare-slider";
import { Stage } from "./stage";

// The slider filling the 4:3 frame at natural size.
export function CompareSliderStage() {
  return (
    <Stage>
      <div className="overflow-hidden" style={{ width: 800, height: 600 }}>
        <CompareSlider beforeImage="/demo/compare1.webp" afterImage="/demo/compare2.webp" className="h-full" />
      </div>
    </Stage>
  );
}
