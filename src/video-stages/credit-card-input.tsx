"use client";

import { CreditCardInput } from "../../registry/new-york/credit-card-input/credit-card-input";
import { Stage } from "./stage";

export function CreditCardInputStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <CreditCardInput defaultValue={{ number: "4242424242424242", expiry: "12/29", cvc: "123" }} width={340} />
      </div>
    </Stage>
  );
}
