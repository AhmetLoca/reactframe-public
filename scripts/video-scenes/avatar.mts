import { defineScene, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// No cursor: each reset press moves the status dot on (online, away, busy, offline, back to online).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.0,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.6) || at(1.3) || at(2.0) || at(2.7)) await reset(page);
  },
});
