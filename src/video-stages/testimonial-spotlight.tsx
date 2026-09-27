"use client";

import { TestimonialSpotlight } from "../../registry/new-york/testimonial-spotlight/testimonial-spotlight";
import { Stage } from "./stage";

// The registry preview (1100x700, rounded) drawn at 0.61x, as in the thumbnail.
export function TestimonialSpotlightStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.61)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 700, borderRadius: 20 }}>
          <TestimonialSpotlight />
        </div>
      </div>
    </Stage>
  );
}
