import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: the callout steps through success, danger and info, then lands back on warning.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.8) || at(1.6) || at(2.4) || at(3.2)) await reset(page);
  },
});
