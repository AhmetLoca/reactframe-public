import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const button = { x: 268, y: 263 };

// Tap the idle pill to start listening, then tap its stop button. The bottom pill keeps speaking, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  loopBlend: 0.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 470, y: 480 }],
      [1.1, button],
      [1.3, button],
      [1.7, { x: button.x - 60, y: button.y + 70 }],
      [2.9, { x: button.x - 70, y: button.y + 80 }],
      [3.2, button],
      [3.4, button],
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
