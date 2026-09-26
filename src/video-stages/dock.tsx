"use client";

import { Camera, Folder, House, Mail, Music } from "lucide-react";
import { Dock, type DockItem } from "../../registry/new-york/dock/dock";
import { Stage } from "./stage";

const ICON = { width: "50%", height: "50%", strokeWidth: 2 };

const ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: <House {...ICON} />, active: true },
  { id: "files", label: "Files", icon: <Folder {...ICON} /> },
  { id: "mail", label: "Mail", icon: <Mail {...ICON} /> },
  { id: "music", label: "Music", icon: <Music {...ICON} /> },
  { id: "camera", label: "Camera", icon: <Camera {...ICON} /> },
];

export function DockStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Dock items={ITEMS} size="md" />
      </div>
    </Stage>
  );
}
