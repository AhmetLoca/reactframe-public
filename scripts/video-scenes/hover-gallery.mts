import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Sweep slowly along the strip so the slice under the cursor opens wide and its neighbours ease
// aside, then leave so it closes back to even slices.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 100, y: 300 }],
      [1.6, { x: 110, y: 305 }],
      [3.2, { x: 420, y: 300 }],
      [3.8, { x: 425, y: 305 }],
      [4.8, { x: 660, y: 300 }],
      [5.2, { x: 700, y: 560 }],
      [5.4, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.45)) await hideCursor(page);
  },
});
