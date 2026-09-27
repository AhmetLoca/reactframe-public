"use client";

import { InfiniteMarquee } from "../../registry/new-york/infinite-marquee/infinite-marquee";
import { Stage } from "./stage";

// The registry preview, full width.
export function InfiniteMarqueeStage() {
  return (
    <Stage>
      <div className="w-full">
        <InfiniteMarquee
          text="ReactFrame"
          separator="✦"
          fontSize={32}
          textColor="var(--foreground)"
          separatorColor="var(--foreground)"
        />
      </div>
    </Stage>
  );
}
