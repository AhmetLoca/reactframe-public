import { defineScene, stepWebAnimations } from "./_lib.mts";

// The seconds tick down; crossfaded at the seam.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.5,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
