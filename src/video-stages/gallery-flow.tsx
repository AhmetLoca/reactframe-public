"use client";

import { GalleryFlow } from "../../registry/new-york/gallery-flow/gallery-flow";
import { Stage } from "./stage";

// A 1100px-wide flow drawn at 0.678x so the cards match the thumbnail, at the preview's 700px height.
export function GalleryFlowStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.678)" }}>
        <div style={{ width: 1100, height: 700 }}>
          <GalleryFlow backgroundColor="#080808" />
        </div>
      </div>
    </Stage>
  );
}
