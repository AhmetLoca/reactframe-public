import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const shot = { x: 400, y: 320 };

// Click to fire a burst of confetti, then again a moment later; the pieces drift down and clear.
// Loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.3, shot],
      [2.3, { x: 280, y: 280 }],
      [2.8, { x: 700, y: 580 }],
      [3.1, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.35) || at(2.35)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.15)) await hideCursor(page);
  },
});
