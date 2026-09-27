"use client";

import { BrowserMockup } from "../../registry/new-york/browser-mockup/browser-mockup";
import { Stage } from "./stage";

// The registry preview (1100x700) drawn at 0.66x, as in the thumbnail.
export function BrowserMockupStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.66)" }}>
        <div style={{ width: 1100, height: 700 }}>
          <BrowserMockup
            url="reactframe.com"
            pageTitle="ReactFrame"
            tabCount={2}
            media="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80"
          />
        </div>
      </div>
    </Stage>
  );
}
