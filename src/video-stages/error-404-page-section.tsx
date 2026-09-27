"use client";

import { Error404PageSection } from "../../registry/new-york/error-404-page-section/error-404-page-section";
import { Stage } from "./stage";

// The registry preview (dark, with its theme toggle), full frame; the scene records at 1280x960.
export function Error404PageSectionStage() {
  return (
    <Stage>
      <div className="h-full w-full overflow-hidden">
        <Error404PageSection theme="dark" showThemeToggle secondaryLabel="Browse components" className="h-full" />
      </div>
    </Stage>
  );
}
