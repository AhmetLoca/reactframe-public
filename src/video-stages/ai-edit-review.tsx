"use client";

import { AIEditReview } from "../../registry/new-york/ai-edit-review/ai-edit-review";
import { Stage } from "./stage";

// The card at 0.54x natural size, running its select → rewrite → review → apply loop with short timings.
export function AIEditReviewStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.54)" }}>
        <div style={{ width: 833, height: 231 }}>
          <AIEditReview holdSeconds={1} workSeconds={1.2} reviewSeconds={1.6} />
        </div>
      </div>
    </Stage>
  );
}
