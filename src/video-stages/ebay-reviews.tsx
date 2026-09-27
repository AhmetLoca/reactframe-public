"use client";

import { EbayReviews } from "../../registry/new-york/ebay-reviews/ebay-reviews";
import { Stage } from "./stage";

// The registry preview's full-width widget at 1100px, drawn at 0.667x as in the thumbnail. Autoplay
// // is off so the scene's arrow clicks decide the page.
export function EbayReviewsStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.667)" }}>
        <div className="overflow-hidden" style={{ width: 1100 }}>
          <EbayReviews autoPlay={false} />
        </div>
      </div>
    </Stage>
  );
}
