"use client";

import { InlineEdit } from "../../registry/new-york/inline-edit/inline-edit";
import { Stage } from "./stage";

export function InlineEditStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)", width: 260, display: "flex", justifyContent: "center" }}>
        <InlineEdit defaultValue="Untitled project" />
      </div>
    </Stage>
  );
}
