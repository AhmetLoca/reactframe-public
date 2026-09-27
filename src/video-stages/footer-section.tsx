"use client";

import { FooterSection } from "../../registry/new-york/footer-section/footer-section";
import { Stage } from "./stage";

// The registry preview, centred in a full-frame wrapper that scrolls when the block is taller;
// the scene records at 1280x960.
export function FooterSectionStage() {
  return (
    <Stage>
      <div id="video-scroll" className="h-full w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-h-full w-full flex-col justify-center">
          <FooterSection />
        </div>
      </div>
    </Stage>
  );
}
