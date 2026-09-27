"use client";

import { LinkedInPostMockup } from "../../registry/new-york/linkedin-post-mockup/linkedin-post-mockup";
import { Stage } from "./stage";

// The registry preview's 420px post at 0.85x.
export function LinkedinPostMockupStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.85)" }}>
        <div className="w-[420px] max-w-full">
          <LinkedInPostMockup mediaImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" userAvatar="/demo/53.webp" />
        </div>
      </div>
    </Stage>
  );
}
