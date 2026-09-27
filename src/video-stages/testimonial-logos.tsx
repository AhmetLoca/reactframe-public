"use client";

import { TestimonialLogos } from "../../registry/new-york/testimonial-logos/testimonial-logos";
import { Stage } from "./stage";

// The registry preview's 520px card at 0.9x.
export function TestimonialLogosStage() {
  return (
    <Stage>
      <div style={{ width: 520, transform: "scale(0.9)" }}>
        <TestimonialLogos />
      </div>
    </Stage>
  );
}
