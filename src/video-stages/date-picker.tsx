"use client";

import { DatePicker } from "../../registry/new-york/date-picker/date-picker";
import { Stage } from "./stage";

export function DatePickerStage() {
  return (
    <Stage>
      <div id="video-camera" style={{ transform: "scale(1.25)" }}>
        <DatePicker defaultValue={new Date(2026, 8, 25)} size="md" width={240} />
      </div>
    </Stage>
  );
}
