import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on a link in each column, then the credit line.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.7,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 67, y: 394 }],
      [1.2, { x: 69, y: 395 }],
      [1.8, { x: 440, y: 432 }],
      [2.1, { x: 442, y: 433 }],
      [2.7, { x: 805, y: 394 }],
      [3.0, { x: 807, y: 395 }],
      [3.6, { x: 1179, y: 432 }],
      [3.9, { x: 1181, y: 433 }],
      [4.5, { x: 1167, y: 610 }],
      [4.8, { x: 1169, y: 611 }],
      [5.7, { x: 1200, y: 945 }],
      [6.0, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 6.05 && t < 6.10) await hideCursor(page);
  },
});
