import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press brings in the next preset (search, folder, cart, error, back to inbox).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.6) || at(1.5) || at(2.4) || at(3.3) || at(4.2)) await reset(page);
  },
});
