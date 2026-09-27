"use client";

import { AiVoice01 } from "../../registry/new-york/ai-voice-01/ai-voice-01";
import { Stage } from "./stage";

// Top pill starts idle and is tapped in the scene; the bottom one keeps listening throughout.
export function AiVoice01Stage() {
  return (
    <Stage>
      <div className="flex flex-col" style={{ width: 350, gap: 40 }}>
        <div style={{ height: 58 }}>
          <AiVoice01 autoFlow={false} transcript={false} font={{ fontSize: 12.5, lineHeight: 1.2 }} />
        </div>
        <div style={{ height: 58 }}>
          <AiVoice01 status="listening" autoFlow={false} transcript={false} listeningText="Listening..." font={{ fontSize: 12.5, lineHeight: 1.2 }} />
        </div>
      </div>
    </Stage>
  );
}
