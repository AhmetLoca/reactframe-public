"use client";

import * as React from "react";
import { ScratchCardPopup } from "../../registry/new-york/scratch-card-popup/scratch-card-popup";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

// The registry preview's 380px card at 0.78x (so it still fits once the prize and rewards open
// below it), with a seeded prize. #video-reset fades it out and back in
// with a fresh coating.
export function ScratchCardPopupStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => {
    seedRandom(3);
  }, [key]);
  return (
    <Stage onReset={reset}>
      <div className="w-full max-w-[380px]" style={{ transform: "scale(0.78)", ...style }}>
        <ScratchCardPopup key={key} />
      </div>
    </Stage>
  );
}
