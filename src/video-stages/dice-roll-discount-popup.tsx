"use client";

import * as React from "react";
import { DiceRollDiscountPopup } from "../../registry/new-york/dice-roll-discount-popup/dice-roll-discount-popup";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

const clearSaved = () =>
  Object.keys(localStorage)
    .filter((k) => k.startsWith("dice-"))
    .forEach((k) => localStorage.removeItem(k));

// The registry preview's 420px card at 0.95x, with a seeded roll. Saved rolls and rewards are
// cleared on mount and on #video-reset, which fades the card out and back in fresh.
export function DiceRollDiscountPopupStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => {
    if (typeof window !== "undefined") clearSaved();
    seedRandom(21);
  }, [key]);
  return (
    <Stage onReset={reset}>
      <div style={{ width: 420, transform: "scale(0.95)", ...style }}>
        <DiceRollDiscountPopup key={key} />
      </div>
    </Stage>
  );
}
