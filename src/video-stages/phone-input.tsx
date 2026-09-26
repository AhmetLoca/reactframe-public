"use client";

import { PhoneInput } from "../../registry/new-york/phone-input/phone-input";
import { Stage } from "./stage";

export function PhoneInputStage() {
  return (
    <Stage>
      <div id="video-camera" style={{ transform: "scale(1.25)" }}>
        <PhoneInput defaultCountry="TR" defaultValue="+905321234567" preferredCountries={["TR", "US", "GB"]} width={300} />
      </div>
    </Stage>
  );
}
