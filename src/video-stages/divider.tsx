"use client";

import * as React from "react";
import { Divider } from "../../registry/new-york/divider/divider";
import { Stage } from "./stage";

const VARIANTS = ["solid", "dashed", "dotted", "gradient"] as const;

// Each #video-reset press switches to the next line style and remounts it, so the draw-in plays again.
export function DividerStage() {
  const [i, setI] = React.useState(0);
  return (
    <Stage onReset={() => setI((n) => n + 1)}>
      <div style={{ transform: "scale(1.25)", width: 300 }}>
        <Divider key={i} label="OR" accent accentColor="#F59E0B" animated={i > 0} variant={VARIANTS[i % VARIANTS.length]} />
      </div>
    </Stage>
  );
}
