import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the stage remounts the paragraph so it reveals word by word again, ending on the same
// finished text the clip opens with.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.6)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
