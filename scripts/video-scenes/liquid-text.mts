import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The cursor stirs the liquid letters, which ripple and settle back. Loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.4, { x: 250, y: 260 }],
      [2.4, { x: 560, y: 330 }],
      [3.2, { x: 330, y: 340 }],
      [3.9, { x: 520, y: 270 }],
      [4.4, { x: 700, y: 580 }],
      [4.7, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.75)) await hideCursor(page);
  },
});
