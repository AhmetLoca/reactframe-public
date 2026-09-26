"use client";

import { ScrollArea } from "../../registry/new-york/scroll-area/scroll-area";
import { Stage } from "./stage";

// The catalog preview's list, trimmed to the 12 rows the thumbnail was taken with.
function Items() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 18px 16px 4px" }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: 44, padding: "0 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", color: "#F5F4F1", fontSize: 15 }}>
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}

export function ScrollAreaStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.065)" }}>
        <ScrollArea height={250} width={256} alwaysVisible>
          <Items />
        </ScrollArea>
      </div>
    </Stage>
  );
}
