import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on a card in the top row, open it, and close the detail card again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.2,
  loopBlend: 0.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 790, y: 599 }],
      [1.5, { x: 430, y: 190 }],
      [2.1, { x: 440, y: 190 }],
      [3.9, { x: 440, y: 190 }],
      [4.6, { x: 600, y: 599 }],
    ]);
    if (p && t <= 4.6) await page.mouse.move(p.x, p.y);
    if (at(2.1)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.7)) await page.keyboard.press("Escape");
    if (t > 4.6 && t < 4.66) {
      await page.mouse.move(620, 700);
      await hideCursor(page);
    }
  },
});
