import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide along the front of the ring so cards pull out and the centre previews them, drag the ring
// round a little, then leave. The ring doesn't return to its exact angle, so the clip loops
// through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 580 }],
      [0.9, { x: 500, y: 420 }],
      [2.2, { x: 300, y: 410 }],
      [2.6, { x: 300, y: 410 }],
      [3.8, { x: 520, y: 420 }],
      [4.2, { x: 520, y: 420 }],
      [4.8, { x: 700, y: 580 }],
      [5.1, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.6)) await page.mouse.down();
    if (at(3.8)) await page.mouse.up();
    if (at(5.15)) await hideCursor(page);
  },
});
