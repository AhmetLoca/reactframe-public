"use client";

import * as React from "react";
import { Modal } from "../../registry/new-york/modal/modal";
import { Stage } from "./stage";

// Confirm closes the dialog; #video-reset opens it again so the clip loops.
export function ModalStage() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stage onReset={() => setOpen(true)}>
      <div style={{ transform: "scale(1.25)" }}>
        <div style={{ position: "relative", width: 420, height: 260, overflow: "hidden", background: "#050505" }}>
          <Modal
            open={open}
            onOpenChange={setOpen}
            contained
            size="sm"
            title="Delete project?"
            description="This action cannot be undone."
            footer={
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ height: 34, padding: "0 14px", borderRadius: 999, border: "none", background: "#F59E0B", color: "#0A0A0A", fontSize: 13.5, fontWeight: 600, fontFamily: "Inter, sans-serif", cursor: "pointer" }}
              >
                Confirm
              </button>
            }
          />
        </div>
      </div>
    </Stage>
  );
}
