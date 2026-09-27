import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Wheel down so the diamond columns drift at their different speeds, pause, then wheel back past
// the top (where the scroll clamps) so the last frame settles on the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 560 }],
      [0.8, { x: 420, y: 320 }],
      [4.4, { x: 425, y: 325 }],
      [4.8, { x: 620, y: 560 }],
      [5.1, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t >= 0.9 && t < 2.3) await page.mouse.wheel(0, 6);
    if (t >= 2.6 && t < 4.2) await page.mouse.wheel(0, -8);
    if (t >= 5.1 && t < 5.1 + 1 / fps) await hideCursor(page);
  },
});
