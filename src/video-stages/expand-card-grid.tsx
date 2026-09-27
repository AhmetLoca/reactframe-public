"use client";

import { ExpandCardGrid } from "../../registry/new-york/expand-card-grid/expand-card-grid";
import { Stage } from "./stage";

// The registry preview (1100x700) drawn at 0.64x to match the thumbnail.
export function ExpandCardGridStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(0.64)" }}>
        <div style={{ width: 1100, height: 700 }}>
          <ExpandCardGrid
            items={[
              {
                title: "Uphill",
                description: "One more switchback before the summit.",
                buttonText: "View",
                src: "/demo/105.webp",
              },
              {
                title: "Still Water",
                description: "A single scull cutting through the morning.",
                buttonText: "View",
                src: "/demo/102.webp",
              },
              {
                title: "Sprint",
                description: "Every stride pushing a little harder.",
                buttonText: "View",
                src: "/demo/109.webp",
              },
              {
                title: "Downhill",
                description: "Carving fast lines through fresh snow.",
                buttonText: "View",
                src: "/demo/111.webp",
              },
            ]}
          />
        </div>
      </div>
    </Stage>
  );
}
