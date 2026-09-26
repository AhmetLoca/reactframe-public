"use client";

import * as React from "react";
import { EmptyState } from "../../registry/new-york/empty-state/empty-state";
import { Stage } from "./stage";

// Each #video-reset press remounts it on the next preset (with short copy like the thumbnail's),
// ending back on the inbox.
const STATES = [
  { preset: "inbox", title: "No messages", description: "You're all caught up." },
  { preset: "search", title: "No results", description: "Try a different keyword." },
  { preset: "folder", title: "No files yet", description: "Upload a file to get started." },
  { preset: "cart", title: "Your cart is empty", description: "Browse the catalog to start." },
  { preset: "error", title: "Something went wrong", description: "Check your connection and retry." },
] as const;

export function EmptyStateStage() {
  const [i, setI] = React.useState(0);
  const s = STATES[i % STATES.length];
  return (
    <Stage onReset={() => setI((n) => n + 1)}>
      <div style={{ transform: "scale(1.25)" }}>
        <EmptyState key={i} preset={s.preset} title={s.title} description={s.description} size="sm" />
      </div>
    </Stage>
  );
}
