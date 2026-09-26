"use client";

import { HoverCard } from "../../registry/new-york/hover-card/hover-card";
import { Stage } from "./stage";

// Recorded at a 640x480 viewport (like tooltip and popover) because the card portals to <body>.
// The bottom padding lifts the trigger to where the thumbnail has it.
function Profile() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, background: "#F59E0B", color: "#0A0A0A", fontWeight: 700, fontSize: 15 }}>AL</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Ahmet Loca</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Building ReactFrame</span>
      </span>
    </div>
  );
}

export function HoverCardStage() {
  return (
    <Stage>
      <div style={{ paddingBottom: 198 }}>
        <HoverCard defaultOpen width={300} content={<Profile />}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#F59E0B", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            @ahmetloca
          </a>
        </HoverCard>
      </div>
    </Stage>
  );
}
