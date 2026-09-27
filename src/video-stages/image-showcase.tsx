"use client";

import { ImageShowcase } from "../../registry/new-york/image-showcase/image-showcase";
import { Stage } from "./stage";

const IMAGES = [
  { src: "/demo/36.webp", alt: "Showcase 1" },
  { src: "/demo/37.webp", alt: "Showcase 2" },
  { src: "/demo/38.webp", alt: "Showcase 3" },
  { src: "/demo/39.webp", alt: "Showcase 4" },
  { src: "/demo/40.webp", alt: "Showcase 5" },
];

// Matches the thumbnail: a 594px column with a 350px main image and no counter.
export function ImageShowcaseStage() {
  return (
    <Stage>
      <div style={{ width: 594 }}>
        <ImageShowcase height={350} showReset={false} showCounter={false} images={IMAGES} />
      </div>
    </Stage>
  );
}
