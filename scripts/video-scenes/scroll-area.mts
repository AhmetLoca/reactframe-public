import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const over = { x: 390, y: 300 };

// Wheel down to the end of the list and back up to the top, a little each frame so it reads as a
// smooth scroll, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 600, y: 480 }],
      [0.6, over],
      [3.4, over],
      [3.8, { x: 620, y: 480 }],
      [4.1, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t >= 0.8 && t < 1.9) await page.mouse.wheel(0, 16);
    if (t >= 2.2 && t < 3.3) await page.mouse.wheel(0, -24);
    if (at(4.15)) await hideCursor(page);
  },
});
