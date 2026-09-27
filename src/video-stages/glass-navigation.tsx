"use client";

import { GlassNavigation } from "../../registry/new-york/glass-navigation/glass-navigation";
import { Stage } from "./stage";

const GLASS_NAV_DEMO_CTA = {
  light: {
    text: "Get in touch",
    url: "/contact",
    background: "#000000",
    color: "#ffffff",
    height: 36,
    width: 0,
    paddingX: 18,
  },
  dark: {
    text: "Get in touch",
    url: "/contact",
    background: "#ffffff",
    color: "#000000",
    height: 36,
    width: 0,
    paddingX: 18,
  },
};

// The registry preview's 500px box (672px wide nav, 32px top padding), full frame.
export function GlassNavigationStage() {
  return (
    <Stage>
      <div className="flex h-full w-full justify-center px-6 pt-8">
        <div className="h-full w-full max-w-2xl">
          <GlassNavigation cta={GLASS_NAV_DEMO_CTA.light} navFontSize={48} />
        </div>
      </div>
    </Stage>
  );
}
