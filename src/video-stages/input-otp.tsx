"use client";

import * as React from "react";
import { InputOTP } from "../../registry/new-york/input-otp/input-otp";
import { Stage } from "./stage";

export function InputOtpStage() {
  const [value, setValue] = React.useState("4821");
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <InputOTP value={value} onValueChange={setValue} status={value.length === 6 ? "success" : "idle"} size="md" />
      </div>
    </Stage>
  );
}
