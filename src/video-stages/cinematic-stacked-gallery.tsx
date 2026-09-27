"use client";

import { CinematicStackedGallery } from "../../registry/new-york/cinematic-stacked-gallery/cinematic-stacked-gallery";
import { Stage } from "./stage";

// The registry preview (1100x600) drawn at 0.667x in a rounded box, like the thumbnail.
export function CinematicStackedGalleryStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.667)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 600, borderRadius: 18 }}>
          <CinematicStackedGallery />
        </div>
      </div>
    </Stage>
  );
}
