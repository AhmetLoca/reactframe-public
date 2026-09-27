import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Sweep across the strip from right to left so each card grows in turn, rest on the fourth card
// (the one the thumbnail shows open), then leave so the strip settles back to its first frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 760, y: 470 }],
      [0.7, { x: 640, y: 305 }],
      [1.3, { x: 640, y: 305 }],
      [2.9, { x: 170, y: 300 }],
      [3.4, { x: 170, y: 300 }],
      [4.0, { x: 490, y: 300 }],
      [4.7, { x: 495, y: 305 }],
      [5.1, { x: 520, y: 520 }],
      [5.4, { x: 600, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.45)) await hideCursor(page);
  },
});
