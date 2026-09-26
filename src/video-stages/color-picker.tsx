"use client";

import { ColorPicker } from "../../registry/new-york/color-picker/color-picker";
import { Stage } from "./stage";

export function ColorPickerStage() {
  return (
    <Stage>
      <div id="video-camera" style={{ transform: "scale(1.25)" }}>
        <ColorPicker defaultValue="#F59E0B" size="md" width={240} />
      </div>
    </Stage>
  );
}
