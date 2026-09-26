import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the stage animates 80% -> 100% -> 20% -> back to 80%.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.4)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());
  },
});
