import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Hover three cards in turn so each thumbnail zooms and shows its play button, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 580 }],
      [0.9, { x: 150, y: 160 }],
      [1.8, { x: 155, y: 155 }],
      [2.3, { x: 400, y: 160 }],
      [3.2, { x: 405, y: 155 }],
      [3.7, { x: 400, y: 380 }],
      [4.5, { x: 405, y: 375 }],
      [4.9, { x: 620, y: 560 }],
      [5.1, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.15)) await hideCursor(page);
  },
});
