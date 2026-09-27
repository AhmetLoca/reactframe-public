import { defineScene, stepWebAnimations } from "./_lib.mts";

// The trace runs on its own; the clip is one full cycle (4 hops x 900ms + 1.6s hold + 0.4s reset).
// Each run rolls new latencies, so the seam is crossfaded.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  loopBlend: 0.6,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
