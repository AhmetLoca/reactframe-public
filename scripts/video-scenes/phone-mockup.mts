import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The clips play in the phone on their own; drift the cursor around so the phone tilts and its
// glare slides, then leave. The video keeps running, so the clip loops on a
// crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.4, { x: 560, y: 200 }],
      [2.4, { x: 240, y: 230 }],
      [3.3, { x: 280, y: 440 }],
      [4.0, { x: 540, y: 420 }],
      [4.4, { x: 700, y: 580 }],
      [4.7, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.75)) await hideCursor(page);
  },
});
