import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the line scrambles from phrase to phrase on its own; loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.5,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
