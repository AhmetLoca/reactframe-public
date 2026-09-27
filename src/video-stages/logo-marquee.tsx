"use client";

import { LogoMarquee } from "../../registry/new-york/logo-marquee/logo-marquee";
import { Stage } from "./stage";

// The registry preview, full frame.
export function LogoMarqueeStage() {
  return (
    <Stage>
      <div className="flex h-full w-full items-center justify-center">
        <LogoMarquee />
      </div>
    </Stage>
  );
}
