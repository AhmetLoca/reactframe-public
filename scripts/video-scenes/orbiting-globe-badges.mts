import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the globe turns and the badges ride their rings on their own; the clip loops through
// a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
