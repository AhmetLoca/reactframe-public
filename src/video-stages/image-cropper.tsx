"use client";

import { ImageCropper } from "../../registry/new-york/image-cropper/image-cropper";
import { Stage } from "./stage";

const SAMPLE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80";

export function ImageCropperStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.05)" }}>
        <ImageCropper src={SAMPLE} defaultAspect={16 / 9} width={560} height={320} size="sm" />
      </div>
    </Stage>
  );
}
