"use client";

import { Card } from "../../registry/new-york/card/card";
import { Stage } from "./stage";

export function CardStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Card title="Weekly report" description="Revenue is up 12% compared to last week." width={260} interactive spotlight accentColor="#F59E0B" onClick={() => {}} />
      </div>
    </Stage>
  );
}
