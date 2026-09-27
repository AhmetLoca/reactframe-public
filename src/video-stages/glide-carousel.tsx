"use client";

import { GlideCarousel } from "../../registry/new-york/glide-carousel/glide-carousel";
import { Stage } from "./stage";

const GLIDE_CAROUSEL_ITEMS = [
  {
    src: "/demo/101.webp",
    title: "Full Gallop",
    description: "Rider and horse in one breath.",
  },
  {
    src: "/demo/102.webp",
    title: "First Stroke",
    description: "One sculler, glassy water, no wake yet.",
  },
  {
    src: "/demo/105.webp",
    title: "Above the Tree Line",
    description: "A steady climb on loose ground.",
  },
  {
    src: "/demo/108.webp",
    title: "Tailwind",
    description: "Low and fast on an empty road.",
  },
  {
    src: "/demo/109.webp",
    title: "Off the Line",
    description: "The first ten strides decide the race.",
  },
];

// The carousel at 1100x825 drawn at 0.727x, filling the frame.
export function GlideCarouselStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.727)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 825 }}>
          <GlideCarousel items={GLIDE_CAROUSEL_ITEMS} />
        </div>
      </div>
    </Stage>
  );
}
