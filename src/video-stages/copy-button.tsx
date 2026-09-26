"use client";

import { CopyButton } from "../../registry/new-york/copy-button/copy-button";
import { Stage } from "./stage";

export function CopyButtonStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <CopyButton value="npm install @acme/ui" label="Copy" resetDelay={1400} />
      </div>
    </Stage>
  );
}
