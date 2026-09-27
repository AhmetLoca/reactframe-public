import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The gradient drifts on its own; the cursor passes through so the colour follows it. Loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 780, y: 590 }],
      [1.6, { x: 520, y: 240 }],
      [2.6, { x: 280, y: 330 }],
      [3.5, { x: 460, y: 420 }],
      [4.1, { x: 700, y: 580 }],
      [4.4, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.45)) await hideCursor(page);
  },
});
