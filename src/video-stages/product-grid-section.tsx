"use client";

import { ProductGridSection } from "../../registry/new-york/product-grid-section/product-grid-section";
import { Stage } from "./stage";

// The registry preview (1100px wide) drawn at 0.766x to match the thumbnail.
export function ProductGridSectionStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.766)" }}>
        <div style={{ width: 1100 }}>
          <ProductGridSection />
        </div>
      </div>
    </Stage>
  );
}
