import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the call to action, then a link in each column.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.7,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 444 }],
      [1.2, { x: 642, y: 445 }],
      [1.8, { x: 67, y: 641 }],
      [2.1, { x: 69, y: 642 }],
      [2.7, { x: 422, y: 641 }],
      [3.0, { x: 424, y: 642 }],
      [3.6, { x: 806, y: 603 }],
      [3.9, { x: 808, y: 604 }],
      [4.5, { x: 1171, y: 641 }],
      [4.8, { x: 1173, y: 642 }],
      [5.7, { x: 1200, y: 945 }],
      [6.0, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 6.05 && t < 6.10) await hideCursor(page);
  },
});
