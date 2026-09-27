"use client";

import { ReviewCardPortrait } from "../../registry/new-york/review-card-portrait/review-card-portrait";
import { Stage } from "./stage";

// The registry preview's 380x520 card at 0.82x.
export function ReviewCardPortraitStage() {
  return (
    <Stage>
      <div className="overflow-hidden rounded-2xl" style={{ width: 380, height: 520, transform: "scale(0.82)" }}>
        <ReviewCardPortrait />
      </div>
    </Stage>
  );
}
