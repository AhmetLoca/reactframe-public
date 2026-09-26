"use client";

import { House, Inbox, Settings } from "lucide-react";
import { Sidebar, type SidebarSection } from "../../registry/new-york/sidebar/sidebar";
import { Stage } from "./stage";

const ICON = { width: "100%", height: "100%", strokeWidth: 1.6 };

const SECTIONS: SidebarSection[] = [
  {
    id: "main",
    items: [
      { id: "home", label: "Home", icon: <House {...ICON} /> },
      { id: "inbox", label: "Inbox", icon: <Inbox {...ICON} />, badge: 3 },
      {
        id: "reports",
        label: "Reports",
        icon: (
          <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
            <path d="M3.5 12.5V6.5M6.5 12.5V3.5M9.5 12.5V8M12.5 12.5V10M1.5 14h13" />
          </svg>
        ),
      },
      { id: "settings", label: "Settings", icon: <Settings {...ICON} /> },
    ],
  },
];

export function SidebarStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Sidebar sections={SECTIONS} defaultActiveId="home" user={{ name: "Ahmet Loca", subtitle: "Pro plan", initials: "AL" }} width={220} height={300} size="md" />
      </div>
    </Stage>
  );
}
