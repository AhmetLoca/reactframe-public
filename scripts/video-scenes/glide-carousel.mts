import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The strip drifts on autoplay; grab it and fling it along, let it glide to a stop, then leave so
// autoplay picks up again. It never returns to the same offset, so the clip loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.4, { x: 520, y: 320 }],
      [1.55, { x: 520, y: 320 }],
      [2.1, { x: 250, y: 325 }],
      [3.4, { x: 260, y: 330 }],
      [3.9, { x: 560, y: 560 }],
      [4.2, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.55)) await page.mouse.down();
    if (at(2.1)) await page.mouse.up();
    if (at(4.25)) await hideCursor(page);
  },
});
