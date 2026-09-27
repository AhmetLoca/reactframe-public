import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 647, y: 290 };
const dot1 = { x: 371, y: 472 };

// Click the next person to bring them to the front, then the dot for the first, so it ends where
// it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, next],
      [1.1, next],
      [2.4, { x: 450, y: 420 }],
      [2.8, dot1],
      [3.1, dot1],
      [3.8, { x: 700, y: 590 }],
      [4.1, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.95)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.15)) await hideCursor(page);
  },
});
