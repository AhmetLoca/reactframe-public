"use client";

import { Panel } from "../../registry/new-york/panel/panel";
import { Stage } from "./stage";

// Collapsible, so the clip can fold it and open it again; the thumbnail was regenerated to show the chevron.
export function PanelStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Panel title="Notifications" description="Choose what you hear about." dividers accentBar accentColor="#F59E0B" collapsible width={320}>
          Product updates, security alerts and weekly digest.
        </Panel>
      </div>
    </Stage>
  );
}
