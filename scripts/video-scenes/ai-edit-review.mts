import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the component plays its own loop, which never lands on exactly the first frame, so
// the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
