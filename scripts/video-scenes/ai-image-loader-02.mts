import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the loader runs on its own (generate, reveal, restart). It never returns to exactly the
// first frame, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.6,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
