"use client";

import { SignaturePad } from "../../registry/new-york/signature-pad/signature-pad";
import { Stage } from "./stage";

export function SignaturePadStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.2)" }}>
        <SignaturePad label="Signature" width={440} height={200} />
      </div>
    </Stage>
  );
}
