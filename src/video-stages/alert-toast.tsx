"use client";

import * as React from "react";
import { AlertToast } from "../../registry/new-york/alert-toast/alert-toast";
import { Stage } from "./stage";

export function AlertToastStage() {
  // Remounting via key replays the toast's entrance after the scene dismisses it.
  const [take, setTake] = React.useState(0);
  return (
    <Stage onReset={() => setTake((n) => n + 1)}>
      <div style={{ width: 480, transform: "translateX(-3px) scale(0.8)" }}>
        <AlertToast
          key={take}
          content={{ title: "Successfully uploaded!", description: "Your file is now available to everyone on the team.", layout: "stacked" }}
          appearance={{ tone: "success", background: "tinted", accentBar: false, icon: "success", theme: "dark", radius: 12 }}
          actions={{ showPrimary: false, showSecondary: false }}
          dismiss={{ dismissible: true, autoDismiss: false, duration: 4 }}
        />
      </div>
    </Stage>
  );
}
