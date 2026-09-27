"use client";

import { KanbanBoard } from "../../registry/new-york/kanban-board/kanban-board";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The registry preview, full frame. The scene records at 1100x825 (all four columns) instead of
// scaling the board: its position: fixed drag ghost only follows the pointer without a transformed
// ancestor. #video-reset fades the board back to its starting order after the drag.
export function KanbanBoardStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div className="h-full w-full overflow-hidden" style={style}>
        <KanbanBoard key={key} />
      </div>
    </Stage>
  );
}
