"use client";

import * as React from "react";
import { AIAsistant, type AIAsistantShape, type AIAsistantState, type AIAsistantTheme } from "../../registry/new-york/ai-asistant/ai-asistant";
import { Stage } from "./stage";

const CELLS: { theme: AIAsistantTheme; shape: AIAsistantShape; a: string; b: string }[] = [
  { theme: "mesh", shape: "circle", a: "#2B88B1", b: "#0E1E3A" },
  { theme: "mesh", shape: "diamond", a: "#176945", b: "#06231A" },
  { theme: "mesh", shape: "circle", a: "#C47A2A", b: "#221307" },
  { theme: "halo", shape: "diamond", a: "#7C5CFF", b: "#05101F" },
  { theme: "halo", shape: "diamond", a: "#176945", b: "#06231A" },
  { theme: "halo", shape: "circle", a: "#BD4628", b: "#2F132B" },
];
const STATES: AIAsistantState[] = ["waiting", "listening", "thinking"];

// Each #video-reset press moves every light to the next state: waiting → listening → thinking → waiting.
export function AIAsistantStage() {
  const [i, setI] = React.useState(0);
  return (
    <Stage onReset={() => setI((n) => (n + 1) % STATES.length)}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 180px)", gap: "27px 28px" }}>
        {CELLS.map((c, k) => (
          <AIAsistant key={k} size={180} theme={c.theme} shape={c.shape} colorA={c.a} colorB={c.b} state={STATES[i]} />
        ))}
      </div>
    </Stage>
  );
}
