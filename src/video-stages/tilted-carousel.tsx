"use client";

import { TiltedCarousel } from "../../registry/new-york/tilted-carousel/tilted-carousel";
import { Stage } from "./stage";

const TILTED_CAROUSEL_SLIDES = [
  { src: "/demo/23.webp", title: "steady ascent" },
  { src: "/demo/24.webp", title: "raw strength" },
  { src: "/demo/25.webp", title: "downhill carve" },
  { src: "/demo/27.webp", title: "team walk-out" },
  { src: "/demo/28.webp", title: "single scull" },
  { src: "/demo/31.webp", title: "full sprint" },
  { src: "/demo/32.webp", title: "the strike" },
  { src: "/demo/33.webp", title: "open water" },
  { src: "/demo/34.webp", title: "time trial" },
];

// The carousel at 1100x825 drawn at 0.727x, filling the frame.
export function TiltedCarouselStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.727)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 825 }}>
          <TiltedCarousel slides={TILTED_CAROUSEL_SLIDES} />
        </div>
      </div>
    </Stage>
  );
}
