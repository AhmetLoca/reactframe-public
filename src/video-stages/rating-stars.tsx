"use client";

import { RatingStars } from "../../registry/new-york/rating-stars/rating-stars";
import { Stage } from "./stage";

export function RatingStarsStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.15)", width: 231, height: 72, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RatingStars defaultValue={4.5} allowHalf sizePreset="sm" />
      </div>
    </Stage>
  );
}
