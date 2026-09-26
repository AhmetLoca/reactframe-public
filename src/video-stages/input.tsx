"use client";

import { Input } from "../../registry/new-york/input/input";
import { Stage } from "./stage";

export function InputStage() {
  return (
    <Stage>
      <div style={{ width: 350 }}>
        <Input label="Email" type="email" defaultValue="hi@reactframe.com" height={50} fontSize={17} radius={14} />
      </div>
    </Stage>
  );
}
