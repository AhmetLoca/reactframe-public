import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Paint over the portrait so the suit underneath shows through the fluid trail, click once for a
// shockwave, then leave while the reveal heals. The clip ends before the component's idle
// auto-wander (2.5s after the last move) starts; a short crossfade covers what's left.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  loopBlend: 0.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, { x: 520, y: 470 }],
      [1.4, { x: 300, y: 420 }],
      [1.9, { x: 330, y: 300 }],
      [2.4, { x: 500, y: 330 }],
      [2.9, { x: 420, y: 470 }],
      [3.2, { x: 420, y: 470 }],
      [3.8, { x: 700, y: 560 }],
      [4.1, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.15)) await hideCursor(page);
  },
});
