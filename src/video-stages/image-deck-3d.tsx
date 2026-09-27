"use client";

import { ImageDeck3D } from "../../registry/new-york/image-deck-3d/image-deck-3d";
import { Stage } from "./stage";

// The registry preview's square deck at 440px.
export function ImageDeck3dStage() {
  return (
    <Stage>
      <div style={{ width: 440, height: 440 }}>
        <ImageDeck3D image="/demo/2.webp" enable3D idleAnimation />
      </div>
    </Stage>
  );
}
