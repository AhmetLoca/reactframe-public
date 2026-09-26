import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press advances the stage one step (100%, 0%, back to 72%).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.4) || at(1.8) || at(2.5)) await reset(page);
  },
});
