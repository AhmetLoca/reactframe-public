import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll down through the section so the phone stays pinned while the copy, the screen and the
// background colour change slide by slide, then scroll back up by the same distance.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, { x: 420, y: 330 }],
      [5.0, { x: 425, y: 335 }],
      [5.4, { x: 700, y: 560 }],
      [5.7, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t >= 1.0 && t < 2.6) await page.mouse.wheel(0, 30);
    if (t >= 3.0 && t < 4.6) await page.mouse.wheel(0, -30);
    if (at(5.75)) await hideCursor(page);
  },
});
