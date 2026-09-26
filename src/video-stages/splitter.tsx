"use client";

import { Splitter } from "../../registry/new-york/splitter/splitter";
import { Stage } from "./stage";

const label = (text: string) => <div style={{ padding: 20, fontSize: 14, color: "rgba(245,244,241,0.6)", fontFamily: "Inter, sans-serif" }}>{text}</div>;

const PANELS = [
  { id: "editor", content: label("Editor"), defaultSize: 50, minSize: 20 },
  { id: "preview", content: label("Preview"), defaultSize: 50, minSize: 20 },
];

export function SplitterStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Splitter panels={PANELS} width={380} height={200} />
      </div>
    </Stage>
  );
}
