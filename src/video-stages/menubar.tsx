"use client";

import * as React from "react";
import { Menubar, type MenubarMenu } from "../../registry/new-york/menubar/menubar";
import { Stage } from "./stage";

const MENUS: MenubarMenu[] = [
  {
    id: "file",
    label: "File",
    items: [
      { id: "new-tab", kind: "item", label: "New Tab", shortcut: "⌘T" },
      { id: "open", kind: "item", label: "Open…", shortcut: "⌘O" },
      { id: "sep", kind: "separator" },
      { id: "print", kind: "item", label: "Print", shortcut: "⌘P" },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    items: [
      { id: "undo", kind: "item", label: "Undo", shortcut: "⌘Z" },
      { id: "redo", kind: "item", label: "Redo", shortcut: "⇧⌘Z" },
      { id: "sep", kind: "separator" },
      { id: "copy", kind: "item", label: "Copy", shortcut: "⌘C" },
    ],
  },
  {
    id: "view",
    label: "View",
    items: [
      { id: "zoom-in", kind: "item", label: "Zoom In", shortcut: "⌘+" },
      { id: "zoom-out", kind: "item", label: "Zoom Out", shortcut: "⌘−" },
      { id: "sep", kind: "separator" },
      { id: "full", kind: "item", label: "Full Screen", shortcut: "⌃⌘F" },
    ],
  },
];

// The File menu starts open (as in the thumbnail); the scene hovers across the other menus and back.
export function MenubarStage() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const file = [...(ref.current?.querySelectorAll("button") ?? [])].find((b) => b.textContent?.trim() === "File");
    file?.click();
  }, []);
  return (
    <Stage>
      <div ref={ref} style={{ transform: "scale(1.25)", width: 400, height: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <Menubar menus={MENUS} size="md" />
      </div>
    </Stage>
  );
}
