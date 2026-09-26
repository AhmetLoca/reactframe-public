import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: shimmer, the profile loads in, then it goes back to the placeholder. The shimmer loops
// every 1.7s and restarts when the placeholder remounts, so the end is timed to land on the same
// shimmer phase as the first frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3.8,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(1.5) || at(3.0)) await reset(page);
  },
});
