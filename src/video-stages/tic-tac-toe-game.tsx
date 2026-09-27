"use client";

import { TicTacToeGame } from "../../registry/new-york/tic-tac-toe-game/tic-tac-toe-game";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The registry preview's board at 0.8x, two-player (the AI plays at random), so the scene can play
// both sides to the same win every time. #video-reset fades the board out and back in fresh.
export function TicTacToeGameStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div style={{ transform: "scale(0.8)", ...style }}>
        <TicTacToeGame key={key} enableAI={false} />
      </div>
    </Stage>
  );
}
