"use client";

import * as React from "react";
import { MemoryCardsWidget } from "../../registry/new-york/memory-cards-widget/memory-cards-widget";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The widget opened (as the thumbnail shows it), with a seeded shuffle so every recording deals the same
// cards. The saved best score is cleared on mount and on #video-reset, which fades it out and
// back in on a fresh deal.
export function MemoryCardsWidgetStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => {
    if (typeof window !== "undefined") localStorage.removeItem("memory-cards-widget-best");
    seedRandom(12);
  }, [key]);
  return (
    <Stage onReset={reset}>
      <div className="flex items-center justify-center" style={{ width: 800, height: 600, ...style }}>
        <MemoryCardsWidget key={key} defaultOpen />
      </div>
    </Stage>
  );
}
