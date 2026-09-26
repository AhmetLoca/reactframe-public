"use client";

import * as React from "react";
import { Avatar } from "../../registry/new-york/avatar/avatar";
import { Stage } from "./stage";

const STATUSES = ["online", "away", "busy", "offline"] as const;

// Each #video-reset press moves the status dot to the next state, back around to online.
export function AvatarStage() {
  const [i, setI] = React.useState(0);
  return (
    <Stage onReset={() => setI((n) => (n + 1) % STATUSES.length)}>
      <div style={{ transform: "scale(1.25)" }}>
        <Avatar name="Ahmet Loca" size="xl" ring status={STATUSES[i]} color="#F59E0B" />
      </div>
    </Stage>
  );
}
