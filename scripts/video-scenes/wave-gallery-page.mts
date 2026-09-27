import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The stage opens on the sixth item. Wheel down through a couple of items and back up by exactly
// the same distance (short of the bottom, so nothing clamps), so the clip ends where it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 580 }],
      [0.8, { x: 420, y: 320 }],
      [4.6, { x: 425, y: 325 }],
      [5.0, { x: 700, y: 560 }],
      [5.3, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t >= 1.0 && t < 2.2) await page.mouse.wheel(0, 5);
    if (t >= 2.8 && t < 4.0) await page.mouse.wheel(0, -5);
    if (at(5.35)) await hideCursor(page);
  },
});
