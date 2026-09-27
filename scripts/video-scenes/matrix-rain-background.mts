import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the rain falls on its own and never repeats, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
