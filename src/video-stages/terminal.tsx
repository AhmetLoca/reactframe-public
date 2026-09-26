"use client";

import { Terminal } from "../../registry/new-york/terminal/terminal";
import { Stage } from "./stage";

const LINES = [
  { id: "1", type: "command" as const, text: "npx shadcn add reactframe/button" },
  { id: "2", type: "output" as const, text: "✔ Installed 1 component." },
  { id: "3", type: "command" as const, text: "npm run dev" },
];

// Fast enough to finish typing inside the recorder's settle time, so the clip opens on the finished
// session (with the replay button) like the thumbnail; the scene clicks replay to type it again.
export function TerminalStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Terminal lines={LINES} loop={false} typingSpeed={22} startDelay={200} lineDelay={320} width={400} height={220} />
      </div>
    </Stage>
  );
}
