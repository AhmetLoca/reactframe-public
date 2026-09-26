"use client";

import * as React from "react";
import { ConfirmDialog } from "../../registry/new-york/confirm-dialog/confirm-dialog";
import { Stage } from "./stage";

// Discard runs a short async confirm (spinner, then close); #video-reset opens the dialog again.
export function ConfirmDialogStage() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stage onReset={() => setOpen(true)}>
      <div style={{ transform: "scale(1.25)" }}>
        <div style={{ position: "relative", width: 420, height: 260, overflow: "hidden", background: "#050505" }}>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            contained
            variant="warning"
            title="Discard changes?"
            description="Your unsaved edits will be lost."
            confirmLabel="Discard"
            onConfirm={() => new Promise<void>((resolve) => setTimeout(resolve, 900))}
          />
        </div>
      </div>
    </Stage>
  );
}
