import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 750, y: 338 };
const prev = { x: 50, y: 338 };

// Page forward to the next reviews with the right arrow, then back with the left one.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, next],
      [2.0, next],
      [2.8, prev],
      [3.4, prev],
      [4.0, { x: 500, y: 590 }],
      [4.3, { x: 560, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.35)) await hideCursor(page);
  },
});
