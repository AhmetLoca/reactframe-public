import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Hover three product cards in turn (each image zooms and shows its overlay), then the Explore
// All button, and leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 170, y: 195 }],
      [1.8, { x: 175, y: 200 }],
      [2.3, { x: 400, y: 195 }],
      [3.1, { x: 405, y: 200 }],
      [3.6, { x: 640, y: 390 }],
      [4.3, { x: 645, y: 395 }],
      [4.7, { x: 400, y: 528 }],
      [5.1, { x: 402, y: 530 }],
      [5.4, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.45)) await hideCursor(page);
  },
});
