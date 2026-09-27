import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The aura trail follows the cursor round the frame and fades once it leaves. Loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 780, y: 590 }],
      [1.4, { x: 260, y: 220 }],
      [2.4, { x: 560, y: 260 }],
      [3.2, { x: 300, y: 420 }],
      [3.9, { x: 520, y: 380 }],
      [4.4, { x: 700, y: 580 }],
      [4.7, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.75)) await hideCursor(page);
  },
});
