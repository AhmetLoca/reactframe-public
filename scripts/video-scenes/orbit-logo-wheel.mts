import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the front logo: the wheel pauses (it pauses whenever the pointer is over it) and that
// logo grows. The wheel turns for 0.9s before the cursor comes in and 1.85s after it leaves:
// one logo step (22s / 8 logos) in all, so it lines up with its start and the initials crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  loopBlend: 0.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 700, y: 599 }],
      [1.5, { x: 420, y: 376 }],
      [3.5, { x: 425, y: 380 }],
      [4.15, { x: 600, y: 599 }],
    ]);
    if (p && t <= 4.15) await page.mouse.move(p.x, p.y);
    if (t > 4.15 && t < 4.21) {
      await page.mouse.move(620, 700);
      await hideCursor(page);
    }
  },
});
