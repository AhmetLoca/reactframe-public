"use client";

import * as React from "react";
import { Callout } from "../../registry/new-york/callout/callout";
import { Stage } from "./stage";

// Each #video-reset press moves to the next tone, ending back on the thumbnail's warning callout.
const STEPS = [
  { variant: "warning", title: "Heads up", body: "Your trial ends in 3 days." },
  { variant: "success", title: "Payment received", body: "Your Pro plan is active." },
  { variant: "danger", title: "Payment failed", body: "We couldn't charge your card." },
  { variant: "info", title: "Update available", body: "Version 2.4 is ready to install." },
  { variant: "warning", title: "Heads up", body: "Your trial ends in 3 days." },
] as const;

export function CalloutStage() {
  const [step, setStep] = React.useState(0);
  const s = STEPS[step];
  return (
    <Stage onReset={() => setStep((i) => Math.min(i + 1, STEPS.length - 1))}>
      <div style={{ transform: "scale(1.25)" }}>
        <Callout variant={s.variant} title={s.title} size="md" width={320}>
          {s.body}
        </Callout>
      </div>
    </Stage>
  );
}
