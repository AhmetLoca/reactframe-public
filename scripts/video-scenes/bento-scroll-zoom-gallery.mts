import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Wheel down so the centre tile zooms out to fill the frame while the others push away, hold, then
// wheel back up by the same distance so the bento settles where it began.
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
    if (t >= 1.0 && t < 2.4) await page.mouse.wheel(0, 18);
    if (t >= 3.0 && t < 4.4) await page.mouse.wheel(0, -18);
    if (at(5.75)) await hideCursor(page);
  },
});
