"use client";

import { TimePicker } from "../../registry/new-york/time-picker/time-picker";
import { Stage } from "./stage";

export function TimePickerStage() {
  return (
    <Stage>
      <div id="video-camera" style={{ transform: "scale(1.25)" }}>
        <TimePicker defaultValue="09:30" size="md" width={240} />
      </div>
    </Stage>
  );
}
