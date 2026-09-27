"use client";

import { PhoneMockup } from "../../registry/new-york/phone-mockup/phone-mockup";
import { Stage } from "./stage";

const PHONE_MOCKUP_MEDIA = [
  { type: "video" as const, src: "/demo/SocialMedia05.mp4" },
  { type: "video" as const, src: "/demo/SocialMedia03.mp4" },
  { type: "video" as const, src: "/demo/SocialMedia06.mp4" },
];

// The registry preview (1100x700) drawn at 0.727x, letterboxed like the thumbnail.
export function PhoneMockupStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.727)" }}>
        <div className="overflow-hidden" style={{ width: 1100, height: 700 }}>
          <PhoneMockup media={PHONE_MOCKUP_MEDIA} />
        </div>
      </div>
    </Stage>
  );
}
