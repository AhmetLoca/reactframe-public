"use client";

import { TagInput } from "../../registry/new-york/tag-input/tag-input";
import { Stage } from "./stage";

export function TagInputStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <TagInput defaultValue={["react", "motion", "tailwind"]} placeholder="Add a tag..." width={300} />
      </div>
    </Stage>
  );
}
