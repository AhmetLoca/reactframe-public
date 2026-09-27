import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: every light steps through its states (listening, thinking, back to waiting). The dots
// never repeat exactly, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.6,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(1.0) || at(2.4) || at(3.8)) await page.evaluate(() => document.getElementById("video-reset")?.click());
  },
});
