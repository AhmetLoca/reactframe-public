"use client";

import * as React from "react";
import { Tooltip } from "../../registry/new-york/tooltip/tooltip";
import { Button } from "../../registry/new-york/button/button";
import { Stage } from "./stage";

// Recorded at a 640x480 viewport (scaled up to the 960x720 clip) rather than with a scaled wrapper,
// because the tooltip portals to <body> and wouldn't pick up a wrapper's transform. A synthetic
// mouseover opens it on load (no cursor, no focus ring) to match the static thumbnail.
export function TooltipStage() {
  const [copied, setCopied] = React.useState(false);
  const wrap = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    wrap.current?.querySelector("button")?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  }, []);
  return (
    <Stage onReset={() => setCopied(false)}>
      <div ref={wrap} id="tooltip-trigger">
        <Tooltip content={copied ? "Copied!" : "Copy to clipboard"} shortcut={copied ? undefined : "⌘C"} placement="top">
          <Button label="Hover me" onClick={() => setCopied(true)} height={36} paddingX={16} fontSize={13} radius={999} accentColor="#F59E0B" accentTextColor="#111111" />
        </Tooltip>
      </div>
    </Stage>
  );
}
