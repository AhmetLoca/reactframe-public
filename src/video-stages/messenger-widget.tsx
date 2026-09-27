"use client";

import { MessengerWidget } from "../../registry/new-york/messenger-widget/messenger-widget";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

// The launcher in the bottom-right of the frame with its panel open, as on a page. #video-reset
// fades it out and remounts it, so the scene can end on the fresh open panel it started with.
export function MessengerWidgetStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div className="relative flex items-end justify-end" style={{ width: 800, height: 600, padding: 24, ...style }}>
        <MessengerWidget key={key}
          pageId="reactframe"
          fixed={false}
          position="bottom-right"
          popupDelay={0}
          autoOpenDelay={0.1}
        />
      </div>
    </Stage>
  );
}
