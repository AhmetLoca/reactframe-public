import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const mic = { x: 253, y: 251 };

// Tap the idle pill to start listening, let the curves move for a moment, tap again to stop. The
// bottom pill keeps listening, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  loopBlend: 0.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 460, y: 470 }],
      [1.1, mic],
      [1.3, mic],
      [1.7, { x: 380, y: 330 }],
      [2.9, { x: 360, y: 320 }],
      [3.2, mic],
      [3.4, mic],
      [3.8, { x: 560, y: 520 }],
      [4.1, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.2) || at(3.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.15)) await hideCursor(page);
  },
});
