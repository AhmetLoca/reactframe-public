"use client";

import { FooterPremium } from "../../registry/new-york/footer-premium/footer-premium";
import { Stage } from "./stage";

// The registry preview, centred in a full-frame wrapper that scrolls when the block is taller;
// the scene records at 1280x960.
export function FooterPremiumStage() {
  return (
    <Stage>
      <div id="video-scroll" className="h-full w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-h-full w-full flex-col justify-center">
          <FooterPremium showBadge showPill />
        </div>
      </div>
    </Stage>
  );
}
