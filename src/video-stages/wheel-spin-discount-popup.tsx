"use client";

import * as React from "react";
import { WheelSpinDiscountPopup } from "../../registry/new-york/wheel-spin-discount-popup/wheel-spin-discount-popup";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

const clearSaved = () =>
  Object.keys(localStorage)
    .filter((k) => /spin|reward/i.test(k))
    .forEach((k) => localStorage.removeItem(k));

// The registry preview's 420px card at 0.72x, with a seeded spin. Saved spins and rewards are
// cleared on mount and on #video-reset, which fades the card out and back in fresh.
export function WheelSpinDiscountPopupStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => {
    if (typeof window !== "undefined") clearSaved();
    seedRandom(11);
  }, [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 420, transform: "scale(0.72)", ...style }}>
        <WheelSpinDiscountPopup key={key} />
      </div>
    </Stage>
  );
}
