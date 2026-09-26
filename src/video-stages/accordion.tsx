"use client";

import { Accordion } from "../../registry/new-york/accordion/accordion";
import { Stage } from "./stage";

const ITEMS = [
  { value: "what", title: "What is ReactFrame?", content: "A library of animated React components." },
  { value: "free", title: "Is it free?", content: "Most components are free. Premium ones are $4 to $8." },
];

export function AccordionStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <Accordion items={ITEMS} defaultValue={["what"]} width={320} />
      </div>
    </Stage>
  );
}
