import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: the gauge reads 95%, then 20%, then settles back on 68%.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.6) || at(1.8) || at(3.0)) await reset(page);
  },
});
