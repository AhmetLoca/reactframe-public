"use client";

import { TikTokPostMockup } from "../../registry/new-york/tiktok-post-mockup/tiktok-post-mockup";
import { Stage } from "./stage";

// The registry preview's 315px post at 0.85x.
export function TiktokPostMockupStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.85)" }}>
        <div className="w-[315px]">
          <TikTokPostMockup
            background="/demo/112.webp"
            userAvatar="/demo/112.webp"
            description="Good morning!"
          />
        </div>
      </div>
    </Stage>
  );
}
