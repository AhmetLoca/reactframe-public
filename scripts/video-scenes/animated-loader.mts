import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: the loader keeps spinning while it steps through ring, dual-ring and lines, then
// lands back on dots.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.9) || at(1.8) || at(2.7) || at(3.6)) await reset(page);
  },
});
