"use client";

import { Select } from "../../registry/new-york/select/select";
import { Stage } from "./stage";

export function SelectStage() {
  return (
    <Stage>
      <Select defaultValue="design" width={275} size={19} radius={18} accentColor="#F59E0B" maxMenuHeight={236} />
    </Stage>
  );
}
