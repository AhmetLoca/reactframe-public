import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press completes the next step ("Out for delivery", then "Delivered"), and the
// last press rewinds to the starting state.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.8) || at(1.9) || at(3.0)) await reset(page);
  },
});
