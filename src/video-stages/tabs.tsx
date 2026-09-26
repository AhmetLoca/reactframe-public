"use client";

import { Tabs } from "../../registry/new-york/tabs/tabs";
import { Stage } from "./stage";

const ITEMS = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
];

export function TabsStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Tabs items={ITEMS} defaultValue="overview" variant="pill" size="md" accentColor="#F59E0B" />
      </div>
    </Stage>
  );
}
