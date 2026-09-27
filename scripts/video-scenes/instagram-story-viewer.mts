import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the viewer autoplays through its stories on its own. Under the recorder's stepped
// clock each story runs about 1.23s, so 4.93s is one full lap of four and the clip lands back in
// the same phase; a short crossfade hides what's left.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.93,
  loopBlend: 0.3,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
