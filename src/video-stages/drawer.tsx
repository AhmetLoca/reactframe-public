"use client";

import * as React from "react";
import { Drawer } from "../../registry/new-york/drawer/drawer";
import { Stage } from "./stage";

// The close button dismisses the drawer; #video-reset slides it back in so the clip loops.
export function DrawerStage() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stage onReset={() => setOpen(true)}>
      <div style={{ transform: "scale(1.25)" }}>
        <div style={{ position: "relative", width: 440, height: 280, overflow: "hidden", borderRadius: 16, background: "#050505" }}>
          <Drawer open={open} onOpenChange={setOpen} contained side="right" size="sm" title="Filters" description="Narrow down results." />
        </div>
      </div>
    </Stage>
  );
}
