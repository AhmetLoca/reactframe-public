"use client";

import * as React from "react";
import { QrCodeWidget } from "../../registry/new-york/qr-code-widget/qr-code-widget";
import { Stage } from "./stage";

// The registry preview's 380px card at 0.85x. #video-reset remounts it, which replays its
// entrance.
export function QrCodeWidgetStage() {
  const [key, setKey] = React.useState(0);
  return (
    <Stage onReset={() => setKey((k) => k + 1)}>
      <div style={{ width: 380, transform: "scale(0.85)" }}>
        <QrCodeWidget key={key} qrImage="/demo/qr-reactframe.svg" linkUrl="https://reactframe.com" />
      </div>
    </Stage>
  );
}
