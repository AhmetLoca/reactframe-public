import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on each of the three cards in turn, left to right.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 100, y: 620 }],
      [0.9, { x: 150, y: 300 }],
      [1.6, { x: 190, y: 330 }],
      [2.1, { x: 400, y: 300 }],
      [2.8, { x: 440, y: 330 }],
      [3.3, { x: 660, y: 300 }],
      [3.9, { x: 700, y: 330 }],
      [4.3, { x: 760, y: 590 }],
      [4.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.65 && t < 4.7) await hideCursor(page);
  },
});
