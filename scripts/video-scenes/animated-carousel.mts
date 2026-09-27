import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the ring of cards turns on its own; the clip loops through
// a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
