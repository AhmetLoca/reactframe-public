"use client";

import { DescriptionList } from "../../registry/new-york/description-list/description-list";
import { Stage } from "./stage";

const ITEMS = [
  { id: "name", term: "Name", description: "Ahmet Loca" },
  { id: "plan", term: "Plan", description: "Pro" },
  { id: "email", term: "Email", description: "hi@reactframe.com", copyable: true },
];

export function DescriptionListStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <DescriptionList items={ITEMS} bordered dividers width={340} />
      </div>
    </Stage>
  );
}
