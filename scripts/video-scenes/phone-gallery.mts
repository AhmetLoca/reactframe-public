import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const prev = { x: 343, y: 497 };
const next = { x: 457, y: 497 };

// Step forward twice with the arrow (the phones swap places in the fan), then back twice to the
// slide the clip opened on.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, next],
      [2.4, next],
      [2.8, prev],
      [4.3, prev],
      [4.9, { x: 620, y: 580 }],
      [5.2, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(1.8) || at(2.9) || at(3.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.25)) await hideCursor(page);
  },
});
