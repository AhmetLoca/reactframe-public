import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide over the map so countries and pins highlight with their tooltips, then leave. The arcs keep
// animating, so the clip loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.4, { x: 180, y: 230 }],
      [2.3, { x: 250, y: 400 }],
      [3.1, { x: 420, y: 200 }],
      [3.8, { x: 650, y: 420 }],
      [4.3, { x: 720, y: 590 }],
      [4.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.65)) await hideCursor(page);
  },
});
