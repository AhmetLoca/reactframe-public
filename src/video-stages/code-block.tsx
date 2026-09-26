"use client";

import { CodeBlock } from "../../registry/new-york/code-block/code-block";
import { Stage } from "./stage";

const CODE = `export function Button() {
  return (
    <button className="btn">
      Click me
    </button>
  );
}`;

export function CodeBlockStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <CodeBlock code={CODE} language="tsx" filename="button.tsx" width={380} />
      </div>
    </Stage>
  );
}
