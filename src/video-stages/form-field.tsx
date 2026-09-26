"use client";

import * as React from "react";
import { FormField } from "../../registry/new-york/form-field/form-field";
import { Stage } from "./stage";

const TAKEN = ["admin", "root"];

// #video-reset remounts the field so the clip can end on the empty start state.
export function FormFieldStage() {
  const [key, setKey] = React.useState(0);
  return (
    <Stage onReset={() => setKey((k) => k + 1)}>
      <div style={{ transform: "scale(1.25)" }}>
        <FormField
          key={key}
          label="Username"
          required
          info="Letters, numbers and dashes."
          placeholder="Pick a username"
          helperText="This is your public handle"
          successText="Username is available"
          width={300}
          validate={async (v) => {
            await new Promise((r) => setTimeout(r, 600));
            return TAKEN.includes(v.toLowerCase()) ? "That username is taken" : null;
          }}
        />
      </div>
    </Stage>
  );
}
