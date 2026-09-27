import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Grab the globe and drag it east towards Africa, let it coast back to its slow auto-spin, then leave. The
// globe never returns to the same angle, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 780, y: 590 }],
      [1.3, { x: 470, y: 300 }],
      [1.45, { x: 470, y: 300 }],
      [2.1, { x: 330, y: 305 }],
      [2.6, { x: 560, y: 450 }],
      [2.9, { x: 820, y: 660 }],
    ]);
    if (p && t < 2.95) await page.mouse.move(p.x, p.y);
    if (at(1.45)) await page.mouse.down();
    if (at(2.1)) await page.mouse.up();
    if (at(2.95)) await hideCursor(page);
  },
});
