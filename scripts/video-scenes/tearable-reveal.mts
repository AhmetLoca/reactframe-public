import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const reset = { x: 753, y: 568 };

// Grab the cover and drag across it so it tears away and shows the photo beneath, then press
// Reset so the cover mends and the clip ends as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 520 }],
      [0.8, { x: 180, y: 180 }],
      [1.0, { x: 180, y: 180 }],
      [2.0, { x: 560, y: 260 }],
      [2.6, { x: 360, y: 420 }],
      [3.1, { x: 620, y: 470 }],
      [3.8, reset],
      [4.1, reset],
      [4.7, { x: 620, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0)) await page.mouse.down();
    if (at(3.1)) await page.mouse.up();
    if (at(4.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.75)) await hideCursor(page);
  },
});
