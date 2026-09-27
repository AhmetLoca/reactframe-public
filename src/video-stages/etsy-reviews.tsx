"use client";

import { EtsyReviews } from "../../registry/new-york/etsy-reviews/etsy-reviews";
import { Stage } from "./stage";

// The registry preview's full-width widget at 1100px, drawn at 0.667x as in the thumbnail. Autoplay
// // is off so the scene's arrow clicks decide the page.
export function EtsyReviewsStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.667)" }}>
        <div className="overflow-hidden" style={{ width: 1100 }}>
          <EtsyReviews autoPlay={false} />
        </div>
      </div>
    </Stage>
  );
}
