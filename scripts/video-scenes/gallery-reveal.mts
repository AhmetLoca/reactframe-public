import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide over three cards so each one plays its reveal from the side the cursor enters, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 580 }],
      [0.9, { x: 400, y: 190 }],
      [1.9, { x: 405, y: 185 }],
      [2.4, { x: 600, y: 190 }],
      [3.3, { x: 600, y: 195 }],
      [3.8, { x: 400, y: 420 }],
      [4.7, { x: 405, y: 425 }],
      [5.1, { x: 560, y: 610 }],
      [5.3, { x: 640, y: 680 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.35)) await hideCursor(page);
  },
});
