"use client";

import * as React from "react";
import { ContextMenu, type ContextMenuItem } from "../../registry/new-york/context-menu/context-menu";
import { Stage } from "./stage";

const ITEMS: ContextMenuItem[] = [
  { id: "copy", kind: "item", label: "Copy", shortcut: "⌘C" },
  { id: "paste", kind: "item", label: "Paste", shortcut: "⌘V" },
  { id: "sep", kind: "separator" },
  { id: "delete", kind: "item", label: "Delete", danger: true },
];

// Recorded at a 640x480 viewport (the menu portals to <body>). A synthetic right-click on mount opens
// the menu where the thumbnail shows it.
export function ContextMenuStage() {
  const area = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const id = setTimeout(() => area.current?.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 270, clientY: 200, button: 2 })), 50);
    return () => clearTimeout(id);
  }, []);
  return (
    <Stage>
      <ContextMenu items={ITEMS} width={220}>
        <div ref={area} style={{ width: 320, height: 200, borderRadius: 18, border: "1.5px dashed rgba(255,255,255,0.18)" }} />
      </ContextMenu>
    </Stage>
  );
}
