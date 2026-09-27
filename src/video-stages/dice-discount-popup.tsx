"use client";

import * as React from "react";
import { DiceDiscountPopup } from "../../registry/new-york/dice-discount-popup/dice-discount-popup";
import { useFadeReset } from "./_fade-reset";
import { seedRandom } from "./_seeded-random";
import { Stage } from "./stage";

const clearSaved = () =>
  Object.keys(localStorage)
    .filter((k) => k.startsWith("dice-"))
    .forEach((k) => localStorage.removeItem(k));

// The registry preview's 380px card, with a seeded roll. Saved rolls and rewards are cleared on
// mount and on #video-reset, which fades the card out and back in fresh.
export function DiceDiscountPopupStage() {
  const { key, reset, style } = useFadeReset();
  React.useMemo(() => {
    if (typeof window !== "undefined") clearSaved();
    seedRandom(7);
  }, [key]);
  return (
    <Stage onReset={reset}>
      <div className="w-full max-w-[380px]" style={style}>
        <DiceDiscountPopup key={key} />
      </div>
    </Stage>
  );
}
