"use client";

import * as React from "react";
import { Toolbar, type ToolbarEntry } from "../../registry/new-york/toolbar/toolbar";
import { Stage } from "./stage";

// The subset of the catalog demo's toolbar that the thumbnail shows.
const ITEMS: ToolbarEntry[] = [
  { type: "button", id: "undo", label: "Undo", icon: "undo", shortcut: "⌘Z" },
  { type: "separator" },
  { type: "toggle", id: "bold", label: "Bold", icon: "bold", shortcut: "⌘B" },
  { type: "toggle", id: "italic", label: "Italic", icon: "italic", shortcut: "⌘I" },
  { type: "toggle", id: "underline", label: "Underline", icon: "underline", shortcut: "⌘U" },
  { type: "separator" },
  { type: "toggle", id: "left", label: "Align left", icon: "alignLeft", group: "align" },
  { type: "toggle", id: "center", label: "Align center", icon: "alignCenter", group: "align" },
];

export function ToolbarStage() {
  const [pressed, setPressed] = React.useState<string[]>(["bold", "left"]);
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Toolbar items={ITEMS} value={pressed} onValueChange={setPressed} radius={12} />
      </div>
    </Stage>
  );
}
