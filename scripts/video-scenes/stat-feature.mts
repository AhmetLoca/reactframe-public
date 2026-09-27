import { defineScene, stepWebAnimations } from "./_lib.mts";

// Fade the block out and back in so the rings sweep and the numbers count up from zero; the clip
// ends once they have settled, on the frame it started from.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 4.4,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.2)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
