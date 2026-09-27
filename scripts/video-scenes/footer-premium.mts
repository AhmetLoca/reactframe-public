import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the creator pill, two socials, and a link in each column.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 7.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 228, y: 447 }],
      [1.2, { x: 230, y: 448 }],
      [1.8, { x: 145, y: 565 }],
      [2.1, { x: 147, y: 566 }],
      [2.7, { x: 189, y: 565 }],
      [3.0, { x: 191, y: 566 }],
      [3.6, { x: 740, y: 403 }],
      [3.9, { x: 742, y: 404 }],
      [4.5, { x: 916, y: 437 }],
      [4.8, { x: 918, y: 438 }],
      [5.4, { x: 1092, y: 403 }],
      [5.7, { x: 1094, y: 404 }],
      [6.6, { x: 1200, y: 945 }],
      [6.9, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 6.95 && t < 7.00) await hideCursor(page);
  },
});
