"use client";

import { DotImageSlider } from "../../registry/new-york/dot-image-slider/dot-image-slider";
import { Stage } from "./stage";

// The thumbnail shows the slider filling the whole 4:3 frame, zoomed 1.3x toward her face.
export function DotImageSliderStage() {
  return (
    <Stage>
      <div style={{ width: 800, height: 600, transform: "scale(1.3)", transformOrigin: "192px 277px" }}>
        <DotImageSlider />
      </div>
    </Stage>
  );
}
