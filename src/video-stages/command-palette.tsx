"use client";

import { CommandPalette, type CommandItem } from "../../registry/new-york/command-palette/command-palette";
import { Stage } from "./stage";

const ITEMS: CommandItem[] = [
  { id: "new-file", label: "New file", group: "Actions", shortcut: ["⌘", "N"] },
  { id: "settings", label: "Open settings", group: "Actions", shortcut: ["⌘", ","] },
  { id: "theme", label: "Toggle dark mode", group: "Preferences", shortcut: ["⌘", "D"], keywords: ["theme"] },
  { id: "language", label: "Change language", group: "Preferences" },
  { id: "profile", label: "Edit profile", group: "Preferences" },
];

export function CommandPaletteStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <div style={{ position: "relative", width: 460, height: 360, overflow: "hidden", background: "#050505" }}>
          <CommandPalette items={ITEMS} defaultOpen contained hotkey="k" closeOnSelect={false} />
        </div>
      </div>
    </Stage>
  );
}
