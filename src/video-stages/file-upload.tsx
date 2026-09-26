"use client";

import { FileUpload } from "../../registry/new-york/file-upload/file-upload";
import { Stage } from "./stage";

// Steady, deterministic progress (the fake clock drives setInterval) so every take looks the same.
const upload = (_file: File, onProgress: (percent: number) => void) =>
  new Promise<void>((resolve) => {
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(100, pct + 5);
      onProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });

export function FileUploadStage() {
  return (
    <Stage>
      {/* Pinned from the top so the drop zone stays put when a file row is added below it. */}
      <div style={{ position: "absolute", top: 188.5, left: "50%", transform: "translateX(-50%) scale(1.25)", transformOrigin: "top center" }}>
        <FileUpload upload={upload} size="md" width={300} />
      </div>
    </Stage>
  );
}
