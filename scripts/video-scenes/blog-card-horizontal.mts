import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide down the three cards, resting on each one's Read button.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 790, y: 20 }],
      [0.9, { x: 380, y: 110 }],
      [1.4, { x: 600, y: 170 }],
      [2.0, { x: 400, y: 300 }],
      [2.5, { x: 600, y: 360 }],
      [3.1, { x: 400, y: 490 }],
      [3.6, { x: 600, y: 548 }],
      [4.2, { x: 740, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.55 && t < 4.6) await hideCursor(page);
  },
});
