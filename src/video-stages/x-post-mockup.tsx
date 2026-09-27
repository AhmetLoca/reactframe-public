"use client";

import { XPostMockup } from "../../registry/new-york/x-post-mockup/x-post-mockup";
import { Stage } from "./stage";

// The registry preview's post at 460px wide.
export function XPostMockupStage() {
  return (
    <Stage>
      <div style={{ width: 460 }}>
        <XPostMockup mediaImage="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=80" userAvatar="/demo/51.webp" />
      </div>
    </Stage>
  );
}
