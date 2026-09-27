"use client";

import { AiVoice05 } from "../../registry/new-york/ai-voice-05/ai-voice-05";
import { Stage } from "./stage";

// The thumbnail shows the component at 0.66x its natural size; draw it natural and scale the whole thing.
const S = 0.66;

// Starts idle; the scene taps the mic to listen and taps again to stop.
export function AiVoice05Stage() {
  return (
    <Stage>
      <div style={{ transform: `scale(${S})` }}>
        <div style={{ width: 325 / S, height: 110 / S }}>
          <AiVoice05 autoFlow={false} transcript={false} />
        </div>
      </div>
    </Stage>
  );
}
