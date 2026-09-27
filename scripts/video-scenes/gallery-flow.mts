import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The cards drift on their own; the cursor rests on one card (which stops under it) and leaves.
// The drift never returns to its start, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.4, { x: 760, y: 560 }],
      [1.1, { x: 330, y: 280 }],
      [3.0, { x: 335, y: 285 }],
      [3.6, { x: 560, y: 480 }],
      [4.0, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.05)) await hideCursor(page);
  },
});
