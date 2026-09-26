import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y = 295;

// Glide across the dock left to right and back so the magnification ripples through every tile,
// click Mail on the way back, then leave from below so the dock settles to its resting frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 180, y: 470 }],
      [0.6, { x: 230, y }],
      [1.6, { x: 570, y }],
      [2.0, { x: 570, y }],
      [2.6, { x: 400, y }],
      [2.95, { x: 400, y }],
      [3.4, { x: 420, y: 470 }],
      [3.8, { x: 460, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.1)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.85)) await hideCursor(page);
  },
});
