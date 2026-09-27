import { defineScene, stepWebAnimations } from "./_lib.mts";

// The two strips run in opposite directions; crossfaded at the seam.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.5,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
