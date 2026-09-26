"use client";

import * as React from "react";
import { RichTextEditor } from "../../registry/new-york/rich-text-editor/rich-text-editor";
import { Stage } from "./stage";

const SAMPLE = "<h2>Launch checklist</h2><p>Everything we need before <strong>Friday</strong>.</p><ul><li>Final copy review</li><li>Pricing page live</li></ul>";

// #video-reset remounts the editor so the clip ends on the starting text.
export function RichTextEditorStage() {
  const [key, setKey] = React.useState(0);
  return (
    <Stage onReset={() => setKey((k) => k + 1)}>
      <div style={{ transform: "scale(1.2)" }}>
        <RichTextEditor key={key} defaultValue={SAMPLE} width={480} minHeight={170} maxHeight={260} showCount={false} size="sm" />
      </div>
    </Stage>
  );
}
