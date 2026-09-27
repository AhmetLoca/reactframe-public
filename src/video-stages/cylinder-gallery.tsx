"use client";

import { CylinderGallery } from "../../registry/new-york/cylinder-gallery/cylinder-gallery";
import { Stage } from "./stage";

// Same settings as the registry preview, pushed down to match the thumbnail crop. rotationSpeed 2.5 turns the cylinder 45°/s, so one full
// turn takes exactly 8s and the clip loops without a seam.
export function CylinderGalleryStage() {
  return (
    <Stage>
      <div style={{ width: 800, transform: "translateY(75px)" }}>
        <CylinderGallery rows={2} columns={7} cylinderRadius={260} cardWidth={220} cardHeight={160} rotationSpeed={2.5} />
      </div>
    </Stage>
  );
}
