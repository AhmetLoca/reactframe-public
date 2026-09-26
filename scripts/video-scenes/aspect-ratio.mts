import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press switches the box to the next ratio (1:1, 4:3, 21:9, 9:16, back to 16:9).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.6) || at(1.4) || at(2.2) || at(3.0) || at(3.8)) await reset(page);
  },
});
