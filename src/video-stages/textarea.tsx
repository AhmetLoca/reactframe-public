"use client";

import { Textarea } from "../../registry/new-york/textarea/textarea";
import { Stage } from "./stage";

export function TextareaStage() {
  return (
    <Stage>
      <div style={{ width: 375 }}>
        <Textarea label="Message" rows={3} maxLength={200} showCounter defaultValue="Loving the new components!" fontSize={17} radius={14} paddingX={18} paddingY={14} />
      </div>
    </Stage>
  );
}
