"use client";

import * as React from "react";
import { AspectRatio } from "../../registry/new-york/aspect-ratio/aspect-ratio";
import { Stage } from "./stage";

// Same height throughout; each #video-reset press swaps to the next ratio, back to 16:9.
const RATIOS = [
  { ratio: 16 / 9, label: "16:9", caption: "HDTV, YouTube, widescreen" },
  { ratio: 1, label: "1:1", caption: "Square" },
  { ratio: 4 / 3, label: "4:3", caption: "SDTV, iPad" },
  { ratio: 21 / 9, label: "21:9", caption: "Ultrawide" },
  { ratio: 9 / 16, label: "9:16", caption: "Stories, Reels" },
];
const HEIGHT = 202.5;
const ACCENT = "#F2A841";

export function AspectRatioStage() {
  const [i, setI] = React.useState(0);
  const item = RATIOS[i % RATIOS.length];
  return (
    <Stage onReset={() => setI((n) => n + 1)}>
      <div style={{ transform: "scale(1.25)", display: "flex", flexDirection: "column", alignItems: "center", gap: 13 }}>
        <AspectRatio ratio={item.ratio} width={Math.round(HEIGHT * item.ratio)} radius={12}>
          <div
            style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", border: `1.5px solid ${ACCENT}`, borderRadius: "inherit", background: `color-mix(in srgb, ${ACCENT} 8%, transparent)` }}
          >
            <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", color: ACCENT }}>{item.label}</span>
          </div>
        </AspectRatio>
        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>{item.caption}</span>
      </div>
    </Stage>
  );
}
