"use client";

import { PasswordInput } from "../../registry/new-york/password-input/password-input";
import { Stage } from "./stage";

export function PasswordInputStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <PasswordInput defaultValue="Blue#Sky26" size="md" width={260} />
      </div>
    </Stage>
  );
}
