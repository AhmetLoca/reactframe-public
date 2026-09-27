"use client";

import { StatFeature } from "../../registry/new-york/stat-feature/stat-feature";
import { useFadeReset } from "./_fade-reset";
import { Stage } from "./stage";

const STAT_FEATURE_PROPS = {
  badge: "INSIGHTS",
  title: "Numbers That Tell the Real Story",
  description: "Clear metrics that help you understand performance, growth and trust at a glance.",
  rings: [
    { value: 88, color: "#3B82F6" },
    { value: 72, color: "#60A5FA" },
    { value: 55, color: "#93C5FD" },
    { value: 40, color: "#BFDBFE" },
  ],
  trendText: "Up 7.4% compared to last period",
  chartCaption: "Growing steadily this quarter",
  chartSubcaption: "Based on activity across the last 90 days",
  stats: [
    { number: "100", suffix: "%", label: "SEO ready out of the box" },
    { number: "620", suffix: "+", label: "Ready-to-use components" },
    { number: "42", suffix: "k+", label: "Builders who rely on us" },
  ],
};

// The registry preview, centred in the frame; the scene records at 1280x960. #video-reset fades
// the block out and remounts it, so the rings and numbers count up again.
export function StatFeatureStage() {
  const { key, reset, style } = useFadeReset();
  return (
    <Stage onReset={reset}>
      <div className="h-full w-full" style={style}>
        <div className="flex min-h-full w-full flex-col justify-center">
          <StatFeature key={key} {...STAT_FEATURE_PROPS} />
        </div>
      </div>
    </Stage>
  );
}
