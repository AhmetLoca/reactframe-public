"use client";

import { CoinFlipGame } from "../../registry/new-york/coin-flip-game/coin-flip-game";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The registry preview's 360px card at 0.775x, to match the thumbnail. #video-reset fades it out and back in fresh,
// clearing the flip history the scene builds up.
export function CoinFlipGameStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div style={{ width: 360, transform: "scale(0.775)", ...style }}>
        <CoinFlipGame key={key} />
      </div>
    </Stage>
  );
}
