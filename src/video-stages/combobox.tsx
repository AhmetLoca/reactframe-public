"use client";

import { Combobox } from "../../registry/new-york/combobox/combobox";
import { Stage } from "./stage";

export function ComboboxStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Combobox defaultValue="react" size="md" width={220} maxMenuHeight={190} />
      </div>
    </Stage>
  );
}
