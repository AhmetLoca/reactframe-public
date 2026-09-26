import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the stage animates 75% -> 100% -> 30% -> back to 75%.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.4)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());
  },
});
