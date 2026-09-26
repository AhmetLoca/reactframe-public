"use client";

import { Tag } from "../../registry/new-york/tag/tag";
import { Stage } from "./stage";

const noop = () => {};

export function TagStage() {
  return (
    <Stage>
      <div style={{ display: "flex", gap: 8, transform: "scale(1.25)" }}>
        <Tag variant="soft" color="amber" dot size="md" onSelectedChange={noop}>
          Design
        </Tag>
        <Tag variant="solid" color="amber" size="md">
          New
        </Tag>
        <Tag variant="outline" color="neutral" size="md" onSelectedChange={noop}>
          Beta
        </Tag>
      </div>
    </Stage>
  );
}
