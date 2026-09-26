"use client";

import { MultiSelect } from "../../registry/new-york/multi-select/multi-select";
import { Stage } from "./stage";

export function MultiSelectStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <MultiSelect defaultValue={["design", "engineering"]} size="md" width={280} maxMenuHeight={180} />
      </div>
    </Stage>
  );
}
