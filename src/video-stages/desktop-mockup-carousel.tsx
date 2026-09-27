"use client";

import { DesktopMockupCarousel } from "../../registry/new-york/desktop-mockup-carousel/desktop-mockup-carousel";
import { Stage } from "./stage";

// The mockup filling the 4:3 frame at natural size.
export function DesktopMockupCarouselStage() {
  return (
    <Stage>
      <div style={{ width: 800, height: 600 }}>
        <DesktopMockupCarousel
          video1="/demo/18.mp4"
          video2="/demo/17.mp4"
          video3="/demo/16.mp4"
          mediaOrder={["V1", "V2", "V3"]}
          tilt
          ambientGlow
        />
      </div>
    </Stage>
  );
}
