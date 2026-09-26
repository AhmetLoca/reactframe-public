"use client";

import { Popover } from "../../registry/new-york/popover/popover";
import { Button } from "../../registry/new-york/button/button";
import { Stage } from "./stage";

// Recorded at a 640x480 viewport (like tooltip) because the popover portals to <body> and wouldn't
// pick up a wrapper's scale. The bottom padding lifts the trigger to where the thumbnail has it.
export function PopoverStage() {
  return (
    <Stage>
      <div style={{ paddingBottom: 164 }}>
        <Popover defaultOpen width={280} placement="bottom" content={<p style={{ margin: 0, fontSize: 13 }}>Share this file with your team.</p>}>
          <Button label="Share" height={36} paddingX={15} fontSize={13.5} radius={999} accentColor="#F59E0B" accentTextColor="#111111" />
        </Popover>
      </div>
    </Stage>
  );
}
