import { defineScene, path } from "./_lib.mts";

const nextArrow = { x: 906, y: 343 };
const prevArrow = { x: 54, y: 343 };

// Next, then back: the last frame is the same as the first, so the clip loops.
export default defineScene({
  viewport: { width: 960, height: 720 },
  duration: 3,
  async frame({ t, page, at }) {
    const p = path(t, [
      [0.25, { x: 640, y: 690 }],
      [0.75, nextArrow],
      [1.0, nextArrow],
      [1.55, prevArrow],
      [1.95, prevArrow],
      [2.5, { x: 300, y: 780 }],
      [2.85, { x: -40, y: 800 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
  },
});
