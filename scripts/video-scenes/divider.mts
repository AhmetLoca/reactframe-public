import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press draws the divider in again in the next style (dashed, dotted, gradient,
// then back to solid).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.5) || at(1.4) || at(2.3) || at(3.2)) await reset(page);
  },
});
