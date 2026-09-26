"use client";

import { Slider } from "../../registry/new-york/slider/slider";
import { Stage } from "./stage";

export function SliderStage() {
  return (
    <Stage>
      <div style={{ transform: "translateY(-3.3px) scale(1.3)" }}>
        <Slider defaultValue={62} width={250} accentColor="#F59E0B" />
      </div>
    </Stage>
  );
}
