"use client";

import { SalesTicketPopup } from "../../registry/new-york/sales-ticket-popup/sales-ticket-popup";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The registry preview's in-place ticket (not pinned to the viewport). Closing it remounts it,
// like the preview's "Show ticket again", so it slides back in and the clip loops.
export function SalesTicketPopupStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage>
      <div className="flex h-full w-full items-center justify-center px-4" style={style}>
        <SalesTicketPopup key={key} fixed={false} trigger="delay" delaySeconds={0.3} onClose={reset} />
      </div>
    </Stage>
  );
}
