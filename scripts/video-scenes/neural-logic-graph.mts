import { defineScene, stepWebAnimations } from "./_lib.mts";

// Particles stream from the sources through the engine to the outputs; crossfaded at the seam.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
